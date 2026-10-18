"""Append a Claude Code session handoff note to the shared Obsidian vault.

Routing:
- Note is filed under a PER-PROJECT folder inside the vault, derived from the
  working directory (e.g. work done in the Stock-Sense repo lands in a
  "Stock Sense" folder). When cwd is a sub-app of a monorepo, the sub-app wins
  so the folder, the frontmatter, and the body all name the same thing.
- Filename is "<YYYY-MM-DD> - <what the session was about>.md". The title comes
  from the FIRST SUBSTANTIVE USER REQUEST in the transcript, not from the
  assistant's closing sentence -- a reply's first line is a conversational
  artifact ("What'd you like to clarify", "Two file get."), and under a terse
  or stylized response register it is pure noise, which is how this vault
  accumulated 654 untitled-in-practice notes. What the user ASKED is stable,
  descriptive, and what you would actually search for later. The assistant's
  last message is still stored as the handoff body; it is just not the title.
- Every later fire for the SAME session_id is
  located by scanning that day's notes for the session's marker prefix (not
  by re-matching the title, which drifts turn to turn) and appended there as
  a new timestamped section, so one session produces one file per day even
  as its handoff text changes. A different session that happens to land on
  the same title gets a numbered suffix instead of clobbering the first.
  Each distinct entry gets its own content-hashed marker so an exact re-fire
  of the same message is a no-op, but genuinely new progress still lands as
  a new section. The file opens with a YAML frontmatter block (project,
  date, session, branch) for Dataview queries.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path


VAULT = Path(
    os.environ.get(
        "CLAUDE_SHARED_OBSIDIAN_VAULT",
        r"C:\Users\whyhe\Downloads\Second Brain\Second Brain",
    )
)
# Subfolder inside each project's folder where session notes are filed.
NOTE_SUBDIR = "Claude Code Sessions"
# Where notes land when we can't identify a real project (e.g. run from ~).
FALLBACK_FOLDER = "_AI Memory"
MAX_SUMMARY_CHARS = 3500
MAX_TITLE_CHARS = 60
# Git status/diffstat are context, not content. Uncapped they dominated the note
# (17 KB entries in a monorepo with generated-file churn).
MAX_GIT_LINES = 12
MAX_REQUEST_CHARS = 400

# Replies/acks that carry no topic -- never title a note with these.
FILLER_PROMPT = re.compile(
    r"^(y(es|ep|eah)?|no|ok(ay)?|sure|thanks|ty|continue|go( ahead)?|do it|"
    r"try again|again|next|stop|wait|fix it|please|hmm+|k|yep do it|"
    r"continue from where you left off|i approved it,? continue)\b[\s.!?]*$",
    re.I,
)
# Transcript noise that is not a real user request.
NON_REQUEST_PREFIXES = (
    "<command-name>", "<command-message>", "<local-command", "<task-notification>",
    "<observed_from_primary_session>", "base directory for this skill:",
    "[request interrupted", "[image:", "[your previous response had no visible output",
    "this session is being continued", "caveat: the messages below",
    "hello memory agent", "you are a claude-mem",
)
# Politeness/framing openers stripped so the title leads with the actual subject.
REQUEST_LEAD_IN = re.compile(
    r"^(please\s+|can you\s+|could you\s+|i want you to\s+|i want to\s+|"
    r"i need you to\s+|i'?d like you to\s+|lets?\s+|let'?s\s+|"
    r"go ahead and\s+|help me\s+|okay,?\s+|ok,?\s+|so,?\s+|umm?,?\s+)+",
    re.I,
)

# Map a normalized cwd substring -> pretty vault folder name. First match wins.
PROJECT_FOLDER_MAP = [
    ("stock-sense", "Stock Sense"),
    ("stocksense", "Stock Sense"),
    ("outreachhq", "OutreachHQ"),
    ("outreach-hq", "OutreachHQ"),
    ("restaurant-leads", "Restaurant Leads"),
    ("stockmind", "StockMind"),
    ("stock-research-agent", "Stock Research Agent"),
    ("lead-gen", "Lead-Gen Scraper"),
    ("billbot", "BillBot"),
    ("tos-scanner", "TOS Scanner"),
    ("edpuzzle", "EdPuzzle Bot"),
    ("pulse", "Pulse Dashboard"),
    ("excuseai", "ExcuseAI"),
]

SECRET_PATTERNS = [
    (re.compile(r"sk-[A-Za-z0-9_-]{20,}"), "[REDACTED_OPENAI_KEY]"),
    (re.compile(r"sk-ant-[A-Za-z0-9_-]{16,}"), "[REDACTED_ANTHROPIC_KEY]"),
    (re.compile(r"ghp_[A-Za-z0-9]{20,}"), "[REDACTED_GITHUB_TOKEN]"),
    (re.compile(r"github_pat_[A-Za-z0-9_]{20,}"), "[REDACTED_GITHUB_TOKEN]"),
    (re.compile(r"(Bearer\s+)[A-Za-z0-9._~+/=-]{20,}"), r"\1[REDACTED_TOKEN]"),
]


def redact(value: str) -> str:
    for pattern, replacement in SECRET_PATTERNS:
        value = pattern.sub(replacement, value)
    return value


def git_output(cwd: str, *args: str) -> str:
    try:
        result = subprocess.run(
            ["git", "-C", cwd, *args],
            capture_output=True,
            text=True,
            timeout=3,
            check=False,
        )
        return result.stdout.strip()
    except Exception:
        return ""


def git_toplevel_name(cwd: str) -> str:
    top = git_output(cwd, "rev-parse", "--show-toplevel")
    return Path(top).name if top else ""


def project_folder(cwd: str) -> str:
    """Pretty vault folder for this project, or the fallback bucket."""
    leaf = Path(cwd).name or ""
    top = git_toplevel_name(cwd)
    # Check the cwd's OWN name before the repo root, so a monorepo sub-app files
    # under itself. Filing outreachhq/ notes in the "Stock Sense" folder while
    # the body said outreachhq is what made past entries contradict themselves.
    for candidate in (leaf, top):
        key = (candidate or "").lower()
        if not key:
            continue
        for needle, pretty in PROJECT_FOLDER_MAP:
            if needle in key:
                return pretty
    raw = top or leaf
    # Home dir / drive root => no real project.
    if not raw or raw.lower() in {"whyhe", "users", "c:", ""}:
        return FALLBACK_FOLDER
    # Fallback: title-case the folder name (e.g. "my-cool-app" -> "My Cool App").
    return re.sub(r"[-_]+", " ", raw).strip().title() or FALLBACK_FOLDER


def sanitize_filename(text: str) -> str:
    """Strip characters Windows forbids in filenames and collapse whitespace."""
    text = re.sub(r'[\\/:*?"<>|]', " ", text)
    text = re.sub(r"\s+", " ", text).strip(" .")
    if len(text) <= MAX_TITLE_CHARS:
        return text
    truncated = text[:MAX_TITLE_CHARS]
    # Cut at the last word boundary so we don't end mid-word (e.g. "committe").
    if " " in truncated:
        truncated = truncated[: truncated.rfind(" ")]
    return truncated.strip(" .")


def yaml_quote(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def find_session_note(note_dir: Path, date_str: str, session_marker_prefix: str) -> Path | None:
    """Find today's existing note for this session, regardless of its title."""
    if not note_dir.is_dir():
        return None
    for path in sorted(note_dir.glob(f"{date_str} - *.md")):
        try:
            if session_marker_prefix in path.read_text(encoding="utf-8"):
                return path
        except OSError:
            continue
    return None


def free_note_path(note_dir: Path, date_str: str, title: str, session_marker_prefix: str) -> Path:
    """Pick a filename for a new note, avoiding collisions with other sessions'
    same-titled notes from the same day."""
    base = note_dir / f"{date_str} - {title}.md"
    if not base.exists():
        return base
    try:
        if session_marker_prefix in base.read_text(encoding="utf-8"):
            return base
    except OSError:
        pass
    counter = 2
    while True:
        candidate = note_dir / f"{date_str} - {title} ({counter}).md"
        if not candidate.exists():
            return candidate
        counter += 1


def clip_lines(text: str, limit: int = MAX_GIT_LINES) -> str:
    """Keep git context to a glance; note the remainder rather than dumping it."""
    lines = text.splitlines()
    if len(lines) <= limit:
        return text
    return "\n".join(lines[:limit] + [f"... +{len(lines) - limit} more"])


def clean_phrase(text: str) -> str:
    """Collapse a blob of prose into one titling phrase."""
    text = re.sub(r"```.*?```", " ", text, flags=re.S)        # code fences
    text = re.sub(r"<[^>]{1,80}>", " ", text)                 # stray tags
    text = re.sub(r"^[#>\-*+\s`]+", "", text.strip())         # md markers
    text = re.sub(r"\s+", " ", text).strip(" `*_")
    text = REQUEST_LEAD_IN.sub("", text)
    return text.strip(" `*_,.")


def first_user_request_from_transcript(path: str) -> str:
    """The first real thing the user asked -- what the session was ABOUT.

    Streams from the top and stops at the first hit, so this stays cheap even
    on multi-megabyte transcripts.
    """
    transcript = Path(path)
    if not transcript.is_file():
        return ""
    try:
        with transcript.open(encoding="utf-8", errors="replace") as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    item = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if item.get("type") != "user" or item.get("toolUseResult"):
                    continue
                content = item.get("message", {}).get("content", "")
                if isinstance(content, list):
                    content = "\n".join(
                        block.get("text", "")
                        for block in content
                        if isinstance(block, dict) and block.get("type") == "text"
                    )
                if not isinstance(content, str):
                    continue
                text = re.sub(
                    r"<system-reminder>.*?</system-reminder>", " ", content, flags=re.S
                ).strip()
                if not text or text.lower().startswith(NON_REQUEST_PREFIXES):
                    continue
                phrase = clean_phrase(text[:MAX_REQUEST_CHARS])
                if len(phrase) < 8 or FILLER_PROMPT.match(phrase):
                    continue
                return phrase
    except OSError:
        return ""
    return ""


def derive_title(request: str, summary: str) -> str:
    """Prefer what the user asked for; fall back to the handoff text."""
    for candidate in (request, summary):
        for raw_line in (candidate or "").splitlines():
            phrase = clean_phrase(raw_line)
            if len(phrase) < 3 or FILLER_PROMPT.match(phrase):
                continue
            # Prefer the first clause -- "fix the email flow -- the button does
            # nothing and the log is empty" titles better as "fix the email
            # flow" than as a mid-sentence truncation at the char cap.
            clause = re.split(r"\s+[—–-]{1,2}\s+|[.;!?]\s+|,\s+(?:and|but|also|then)\b", phrase)[0]
            if len(clause) >= 20:
                phrase = clause
            title = sanitize_filename(phrase)
            if title:
                return title
    return "session"


def assistant_text_from_transcript(path: str) -> str:
    transcript = Path(path)
    if not transcript.is_file():
        return ""
    try:
        lines = transcript.read_text(encoding="utf-8", errors="replace").splitlines()
    except OSError:
        return ""
    for line in reversed(lines):
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if item.get("type") != "assistant":
            continue
        message = item.get("message", {})
        content = message.get("content", "")
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            return "\n".join(
                block.get("text", "")
                for block in content
                if isinstance(block, dict) and block.get("type") == "text"
            )
    return ""


def main() -> int:
    try:
        # Read raw bytes and decode as UTF-8 explicitly -- json.load(sys.stdin)
        # decodes using Windows' locale codepage, which mangles any non-ASCII
        # character (em dashes, emoji) into mojibake.
        raw = sys.stdin.buffer.read()
        event = json.loads(raw.decode("utf-8"))
    except Exception:
        return 0

    cwd = str(event.get("cwd") or os.getcwd())
    session_id = str(event.get("session_id") or event.get("sessionId") or "unknown")
    transcript_path = event.get("transcript_path") or event.get("transcriptPath")
    summary = (
        event.get("last_assistant_message")
        or event.get("lastAssistantMessage")
        or event.get("assistant_message")
        or ""
    )
    if not isinstance(summary, str) or not summary.strip():
        summary = assistant_text_from_transcript(str(transcript_path)) if transcript_path else ""
    summary = redact(str(summary).strip())[:MAX_SUMMARY_CHARS].strip()
    if not summary:
        return 0

    request = (
        first_user_request_from_transcript(str(transcript_path)) if transcript_path else ""
    )
    request = redact(request)

    now = datetime.now().astimezone()
    date_str = now.strftime("%Y-%m-%d")
    project = project_folder(cwd)
    title = derive_title(request, summary)
    branch = git_output(cwd, "branch", "--show-current")
    status = clip_lines(git_output(cwd, "status", "--short"))
    diffstat = clip_lines(git_output(cwd, "diff", "--stat"))

    lines = [
        f"## {now.strftime('%H:%M')} — {title}",
        f"- Project: `{project}`",
        f"- Directory: `{redact(Path(cwd).name or cwd)}`",
        f"- Session: `{redact(session_id)}`",
    ]
    if branch:
        lines.append(f"- Branch: `{redact(branch)}`")
    if status:
        lines.extend(["- Working tree:", "```text", redact(status), "```"])
    if diffstat:
        lines.extend(["- Diff stat:", "```text", redact(diffstat), "```"])
    if request:
        lines.extend(["", "### Asked for", "", f"> {request}", ""])
    lines.extend(["### Handoff summary", "", summary, ""])
    entry = "\n".join(lines)
    entry_hash = hashlib.sha1(summary.encode("utf-8")).hexdigest()[:8]
    session_marker_prefix = f"<!-- claude-session:{session_id}"
    marker = f"{session_marker_prefix}:{entry_hash} -->"

    try:
        note_dir = VAULT / project / NOTE_SUBDIR
        note_dir.mkdir(parents=True, exist_ok=True)
        note = find_session_note(note_dir, date_str, session_marker_prefix)
        if note is None:
            note = free_note_path(note_dir, date_str, title, session_marker_prefix)
        existing = note.read_text(encoding="utf-8") if note.exists() else ""
        if not existing:
            frontmatter = ["---", f"project: {yaml_quote(project)}", f"date: {date_str}", f"session: {yaml_quote(session_id)}"]
            if branch:
                frontmatter.append(f"branch: {yaml_quote(redact(branch))}")
            frontmatter.append("---")
            header = "\n".join(frontmatter) + f"\n\n# {title}\n\n> {project} · {date_str}\n\n"
            note.write_text(header, encoding="utf-8", newline="\n")
            existing = header
        if marker not in existing:
            with note.open("a", encoding="utf-8", newline="\n") as handle:
                handle.write(f"{marker}\n{entry}\n")
    except OSError:
        # Stop hooks must never block the session because the vault is unavailable.
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
