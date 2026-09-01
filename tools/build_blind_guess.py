#!/usr/bin/env python3

from pathlib import Path
import json


ROOT = Path(__file__).resolve().parents[1]

SOURCE = (
    ROOT /
    "data/blind-model-guess.json"
)

OUTPUT = (
    ROOT /
    "guess/blind/model/data.js"
)


data = json.loads(
    SOURCE.read_text(
        encoding="utf-8"
    )
)


OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True
)


OUTPUT.write_text(
    "window.ZORIX_BLIND_MODEL_GUESS = "
    +
    json.dumps(
        data,
        ensure_ascii=False,
        indent=2
    )
    +
    ";\n",
    encoding="utf-8"
)


print(
    "Built:",
    OUTPUT.relative_to(ROOT)
)

print(
    "Candidates:",
    len(
        data.get(
            "candidates",
            []
        )
    )
)

print(
    "Known published votes:",
    data.get(
        "knownPublishedVotes",
        0
    )
)
