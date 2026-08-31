#!/usr/bin/env python3

from pathlib import Path
import json


ROOT = Path(__file__).resolve().parents[1]

SRC = (
    ROOT /
    "data/model-analysis.json"
)

OUT = (
    ROOT /
    "number-of-calls/model-analysis.js"
)


data=json.loads(
    SRC.read_text(
        encoding="utf-8"
    )
)


OUT.write_text(
    "window.ZORIX_MODEL_ANALYSIS = "
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
    "Built model analysis:",
    len(data),
    "models"
)
