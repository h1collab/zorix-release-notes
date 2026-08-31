#!/usr/bin/env python3

import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent

MODELS = ROOT / "data" / "models.json"
DAILY = ROOT / "data" / "model-daily.json"
OUTPUT = ROOT / "number-of-calls" / "usage.js"

models = json.loads(MODELS.read_text(encoding="utf-8"))
daily = json.loads(DAILY.read_text(encoding="utf-8"))

# Some catalog entries use non-token metrics.
# They remain available in the model catalog but must not
# be mixed into the token ranking.
models = [
    model
    for model in models
    if model.get(
        "includeInTokenRanking",
        True
    )
]

models.sort(
    key=lambda x: x.get("tokens", 0),
    reverse=True
)

total = sum(x.get("tokens", 0) for x in models)

for model in models:
    if total:
        model["share"] = round(
            model.get("tokens", 0) / total * 100,
            4
        )
    else:
        model["share"] = 0

payload = {
    "updatedAt": datetime.now().astimezone().isoformat(timespec="seconds"),
    "metric": "tokens",
    "models": models,
    "daily": daily
}

OUTPUT.parent.mkdir(parents=True, exist_ok=True)

OUTPUT.write_text(
    "window.ZORIX_CODE_USAGE = " +
    json.dumps(payload, ensure_ascii=False, indent=2) +
    ";\n",
    encoding="utf-8"
)

print(f"Built {len(models)} models.")
print(f"Total daily tokens: {total:,}")


# Keep the model-detail fallback catalog synchronized.
import subprocess
import sys

index_builder = (
    ROOT /
    "tools/build_model_index.py"
)

if index_builder.exists():

    subprocess.run(
        [
            sys.executable,
            str(index_builder)
        ],
        check=False
    )


# Build extended model analysis metadata.
analysis_builder = (
    ROOT /
    "tools/build_model_analysis.py"
)

if analysis_builder.exists():

    subprocess.run(
        [
            sys.executable,
            str(analysis_builder)
        ],
        check=False
    )


# Build permanent path-based model pages.
page_builder = (
    ROOT /
    "tools/build_model_pages.py"
)

if page_builder.exists():

    subprocess.run(
        [
            sys.executable,
            str(page_builder)
        ],
        check=False
    )
