#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/votes.json"
OUTPUT = ROOT / "number-of-calls/voting/votes.js"


def sort_models(value):
    if not isinstance(value, list):
        return []

    return sorted(
        value,
        key=lambda row: (
            -int(row.get("votes", 0) or 0),
            str(row.get("id", ""))
        )
    )


def list_or_empty(value):
    return value if isinstance(value, list) else []


data = json.loads(
    SOURCE.read_text(encoding="utf-8")
)

models = sort_models(
    data.get("models", [])
)

history = list_or_empty(
    data.get("history", [])
)

raw_categories = data.get("categories", {})
if not isinstance(raw_categories, dict):
    raw_categories = {}

categories = {
    "overall": {
        "label": str(
            raw_categories
            .get("overall", {})
            .get("label", "Overall")
        ) or "Overall"
    }
}

for category_id, raw in raw_categories.items():
    category_id = str(category_id).strip()

    if (
        not category_id
        or category_id == "overall"
        or not isinstance(raw, dict)
    ):
        continue

    categories[category_id] = {
        "label": str(
            raw.get("label", category_id)
        ) or category_id,
        "description": str(
            raw.get("description", "")
        ),
        "models": sort_models(
            raw.get("models", [])
        ),
        "history": list_or_empty(
            raw.get("history", [])
        )
    }

default_category = str(
    data.get("defaultCategory") or "overall"
)

if default_category not in categories:
    default_category = "overall"

payload = {
    "updatedAt": (
        datetime.now()
        .astimezone()
        .isoformat(timespec="seconds")
    ),
    "metric": "community_votes",
    "defaultCategory": default_category,
    "models": models,
    "history": history,
    "categories": categories
}

OUTPUT.write_text(
    "window.ZORIX_COMMUNITY_VOTES = "
    + json.dumps(
        payload,
        ensure_ascii=False,
        indent=2
    )
    + ";\n",
    encoding="utf-8"
)

print("Built:", OUTPUT)
print("Overall models:", len(models))
print("Categories:", ", ".join(categories.keys()))
