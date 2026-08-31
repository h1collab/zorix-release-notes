#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
import json

ROOT = Path(__file__).resolve().parents[1]

SRC = ROOT / "data/status-events.json"
OUT = ROOT / "status/event/events.js"

data = json.loads(
    SRC.read_text(
        encoding="utf-8"
    )
)

data["updatedAt"] = (
    datetime.now()
    .astimezone()
    .isoformat(
        timespec="seconds"
    )
)

events = data.get(
    "events",
    []
)

events.sort(
    key=lambda event:
        event.get(
            "startedAt",
            ""
        ),
    reverse=True
)

SRC.write_text(
    json.dumps(
        data,
        ensure_ascii=False,
        indent=2
    ) + "\n",
    encoding="utf-8"
)

OUT.parent.mkdir(
    parents=True,
    exist_ok=True
)

OUT.write_text(
    "window.ZORIX_STATUS_EVENTS = "
    + json.dumps(
        data,
        ensure_ascii=False,
        indent=2
    )
    + ";\n",
    encoding="utf-8"
)

print(
    f"Built {len(events)} status events."
)
