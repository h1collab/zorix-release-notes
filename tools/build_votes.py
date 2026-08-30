#!/usr/bin/env python3

from pathlib import Path
import json
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]

SOURCE = ROOT / "data/votes.json"
OUTPUT = ROOT / "number-of-calls/voting/votes.js"

data = json.loads(
    SOURCE.read_text(encoding="utf-8")
)

models = data.get("models", [])

models = sorted(
    models,
    key=lambda x: (
        -int(x.get("votes", 0)),
        x.get("id", "")
    )
)

payload = {
    "updatedAt": datetime.now().astimezone().isoformat(timespec="seconds"),
    "metric": "community_votes",
    "models": models
}

OUTPUT.write_text(
    "window.ZORIX_COMMUNITY_VOTES = " +
    json.dumps(
        payload,
        ensure_ascii=False,
        indent=2
    ) +
    ";\n",
    encoding="utf-8"
)

print("Built:", OUTPUT)
