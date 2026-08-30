#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
import json

ROOT = Path(__file__).resolve().parents[1]

SOURCE = ROOT / "data/votes.json"

OUTPUT = (
    ROOT /
    "number-of-calls/voting/votes.js"
)


data = json.loads(
    SOURCE.read_text(
        encoding="utf-8"
    )
)


models = data.get(
    "models",
    []
)


models = sorted(
    models,
    key=lambda x: (
        -int(
            x.get(
                "votes",
                0
            )
        ),
        x.get(
            "id",
            ""
        )
    )
)


history = data.get(
    "history",
    []
)


if not isinstance(
    history,
    list
):
    history = []


payload = {
    "updatedAt":
        datetime.now()
        .astimezone()
        .isoformat(
            timespec="seconds"
        ),

    "metric":
        "community_votes",

    "models":
        models,

    "history":
        history
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


print(
    "Built:",
    OUTPUT
)

print(
    "History snapshots:",
    len(history)
)
