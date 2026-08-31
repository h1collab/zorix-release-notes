#!/usr/bin/env python3

from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

src = ROOT / "data" / "status.json"

out = ROOT / "status" / "status.js"

data = json.loads(
    src.read_text(
        encoding="utf-8"
    )
)

out.write_text(
    "window.ZORIX_STATUS = "
    + json.dumps(
        data,
        ensure_ascii=False,
        indent=2
    )
    + ";\n",
    encoding="utf-8"
)

print("Built:", out)
