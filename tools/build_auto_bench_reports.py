#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
import json


ROOT = Path(__file__).resolve().parents[1]

SRC = (
    ROOT /
    "data/community-reports/bench.json"
)

OUT = (
    ROOT /
    "community/auto/report/bench/reports.js"
)


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


reports = data.get(
    "reports",
    []
)


reports.sort(
    key=lambda item:
        item.get(
            "createdAt",
            ""
        ),
    reverse=True
)


# Base64 PNG can be large, so keep a bounded public history.
data["reports"] = reports[:20]


SRC.write_text(
    json.dumps(
        data,
        ensure_ascii=False,
        indent=2
    ) + "\n",
    encoding="utf-8"
)


OUT.write_text(
    "window.ZORIX_AUTO_BENCH_REPORTS = "
    + json.dumps(
        data,
        ensure_ascii=False,
        indent=2
    )
    + ";\n",
    encoding="utf-8"
)


print(
    "Built",
    len(data["reports"]),
    "community reports."
)
