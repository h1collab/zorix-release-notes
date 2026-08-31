#!/usr/bin/env python3

from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

source = ROOT / "data/model-pricing.json"
target = ROOT / "number-of-calls/model-pricing.js"

try:

    data = json.loads(
        source.read_text(
            encoding="utf-8"
        )
    )

    target.write_text(
        "window.ZORIX_MODEL_PRICING = "
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
        "Built model-pricing.js:",
        len(
            data.get(
                "models",
                {}
            )
        ),
        "model pricing records"
    )

except Exception as exc:

    print(
        "WARNING:",
        exc
    )
