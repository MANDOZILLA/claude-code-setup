#!/usr/bin/env python3
"""UserPromptSubmit hook: warn when a live API key/token is pasted into a prompt."""
import json
import re
import sys

KEY_PATTERNS = [
    (r"sk-or-v1-[a-f0-9]{16,}", "OpenRouter key"),
    (r"sk-ant-[A-Za-z0-9_-]{16,}", "Anthropic key"),
    (r"sk_live_[A-Za-z0-9]{16,}", "Stripe live key"),
    (r"sk_test_[A-Za-z0-9]{16,}", "Stripe test key"),
    (r"ghp_[A-Za-z0-9]{30,}", "GitHub PAT"),
    (r"github_pat_[A-Za-z0-9_]{30,}", "GitHub fine-grained PAT"),
    (r"gsk_[A-Za-z0-9]{30,}", "Groq key"),
    (r"xkeysib-[a-f0-9]{16,}", "Brevo key"),
    (r"tvly-[A-Za-z0-9_-]{16,}", "Tavily key"),
    (r"AKIA[0-9A-Z]{16}", "AWS access key"),
    (r"xox[bap]-[A-Za-z0-9-]{10,}", "Slack token"),
    (r"Bearer\s+eyJ[A-Za-z0-9_-]{20,}", "Bearer JWT"),
]


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    prompt = data.get("prompt", "") or ""
    hits = [label for pat, label in KEY_PATTERNS if re.search(pat, prompt)]
    if not hits:
        sys.exit(0)

    kinds = ", ".join(hits)
    print(json.dumps({
        "systemMessage": (
            f"SECRET IN PROMPT ({kinds}): this key is now stored in plaintext in the "
            "session transcript. Rotate it after this task, and prefer setting it via "
            "an env var or .env.local next time."
        ),
        "hookSpecificOutput": {
            "hookEventName": "UserPromptSubmit",
            "additionalContext": (
                f"The user's prompt contains a live secret ({kinds}). Do NOT echo the "
                "full key back in any response, file, or commit. Write it only to a "
                "gitignored .env.local or OS env var. Remind the user once to rotate "
                "it, since it is now in the transcript on disk."
            ),
        },
    }))
    sys.exit(0)


if __name__ == "__main__":
    main()
