"""Select a free OpenCode model using current Artificial Analysis benchmarks."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

API_URL = "https://artificialanalysis.ai/api/v2/language/models/free"
CACHE_TTL_SECONDS = 12 * 60 * 60
CANDIDATES = (
    {
        "model": "opencode/nemotron-3.5-lightning-free",
        "aliases": ("nemotron-3.5-lightning", "nemotron 3.5 lightning"),
    },
    {
        "model": "opencode/mimo-v2.6-flash-free",
        "aliases": ("mimo-v2.6", "mimo v2.6", "mimo-v2.5", "mimo v2.5"),
    },
    {
        "model": "opencode/nemotron-3-ultra-free",
        "aliases": ("nemotron-3-ultra", "nemotron 3 ultra"),
    },
)


def cache_path() -> Path:
    base = os.environ.get("LOCALAPPDATA") or os.environ.get("TEMP")
    if not base:
        raise RuntimeError("Neither LOCALAPPDATA nor TEMP is set for the benchmark cache.")
    return Path(base) / "OpenCode" / "artificial-analysis-language-models.json"


def get_cached_catalog(path: Path) -> list[dict] | None:
    try:
        cached = json.loads(path.read_text(encoding="utf-8"))
        if time.time() - float(cached["fetched_at"]) < CACHE_TTL_SECONDS:
            return cached["data"]
    except (FileNotFoundError, KeyError, TypeError, ValueError, json.JSONDecodeError):
        return None
    return None


def fetch_catalog(api_key: str) -> list[dict]:
    page = 1
    records: list[dict] = []
    total_pages = 1
    while page <= total_pages:
        request = Request(
            f"{API_URL}?page={page}",
            headers={"x-api-key": api_key, "User-Agent": "opencode-benchmark-router/1.0"},
        )
        try:
            with urlopen(request, timeout=20) as response:
                payload = json.load(response)
        except HTTPError as error:
            if error.code == 401:
                raise RuntimeError("Artificial Analysis rejected ARTIFICIAL_ANALYSIS_API_KEY (401).") from error
            if error.code == 429:
                raise RuntimeError("Artificial Analysis API rate limit reached (429); retry after its reset time.") from error
            raise RuntimeError(f"Artificial Analysis API returned HTTP {error.code}.") from error
        except URLError as error:
            raise RuntimeError(f"Could not reach Artificial Analysis API: {error.reason}") from error

        data = payload.get("data")
        if not isinstance(data, list):
            raise RuntimeError("Artificial Analysis API returned no language-model list.")
        records.extend(data)
        pagination = payload.get("pagination") or {}
        total_pages = int(pagination.get("total_pages", 1))
        page += 1
    return records


def catalog() -> tuple[list[dict], str]:
    path = cache_path()
    cached = get_cached_catalog(path)
    if cached is not None:
        return cached, "cached benchmark data"
    api_key = os.environ.get("ARTIFICIAL_ANALYSIS_API_KEY")
    if not api_key:
        raise RuntimeError("ARTIFICIAL_ANALYSIS_API_KEY is not set.")
    data = fetch_catalog(api_key)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"fetched_at": time.time(), "data": data}), encoding="utf-8")
    return data, "fresh benchmark data"


def scalar(record: dict, *names: str) -> float | None:
    sources = (record, record.get("evaluations") or {})
    for source in sources:
        for name in names:
            value = source.get(name)
            if isinstance(value, (int, float)):
                return float(value)
    return None


def matching_record(candidate: dict, records: list[dict]) -> dict | None:
    for record in records:
        haystack = " ".join(str(record.get(key, "")).lower() for key in ("slug", "name", "id"))
        if any(alias in haystack for alias in candidate["aliases"]):
            return record
    return None


def classify_task(task: str) -> str:
    text = task.lower()
    if re.search(r"\b(architecture|design system|migration|strategy|synthesis|root cause)\b", text):
        return "reasoning"
    if re.search(r"\b(code|implement|bug|debug|test|refactor|typescript|python|api|database|sql)\b", text):
        return "coding"
    if re.search(r"\b(research|compare|investigate|find|source|market|recommend)\b", text):
        return "research"
    return "general"


def score(record: dict, task_class: str, workload: str) -> float:
    intelligence = scalar(record, "artificial_analysis_intelligence_index")
    coding = scalar(record, "artificial_analysis_coding_index")
    agentic = scalar(record, "artificial_analysis_agentic_index")
    speed = scalar(record, "median_output_tokens_per_second")
    if intelligence is None:
        return float("-inf")
    coding = coding if coding is not None else intelligence * 0.75
    agentic = agentic if agentic is not None else intelligence * 0.75
    speed = min(speed if speed is not None else 0.0, 200.0)
    weights = {
        "coding": (0.25, 0.55, 0.20, 0.00),
        "research": (0.70, 0.10, 0.10, 0.10),
        "reasoning": (0.55, 0.25, 0.20, 0.00),
        "general": (0.50, 0.25, 0.15, 0.10),
    }[task_class]
    if workload == "fast":
        weights = (weights[0] * 0.75, weights[1] * 0.75, weights[2] * 0.75, 0.25)
    elif workload == "strong":
        weights = (weights[0] + 0.10, weights[1] + 0.10, weights[2] + 0.05, 0.00)
    return intelligence * weights[0] + coding * weights[1] + agentic * weights[2] + speed * weights[3]


def select(task: str, workload: str) -> dict:
    records, source = catalog()
    task_class = classify_task(task)
    ranked = []
    for candidate in CANDIDATES:
        record = matching_record(candidate, records)
        if record is not None:
            ranked.append((score(record, task_class, workload), candidate["model"], record))
    ranked = [item for item in ranked if item[0] != float("-inf")]
    if not ranked:
        raise RuntimeError("No eligible free OpenCode candidate has current Artificial Analysis benchmark data; refusing to guess.")
    score_value, model, record = max(ranked, key=lambda item: item[0])
    return {
        "model": model,
        "task_class": task_class,
        "reason": f"{source}; ranked {len(ranked)} benchmarked free candidates (score {score_value:.2f})",
        "benchmark_model": record.get("name") or record.get("slug"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", required=True)
    parser.add_argument("--workload", choices=("fast", "standard", "strong"), default="standard")
    args = parser.parse_args()
    try:
        print(json.dumps(select(args.task, args.workload)))
    except RuntimeError as error:
        print(f"Artificial Analysis selector: {error}", file=sys.stderr)
        return 69
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
