#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
import json


ROOT = Path(__file__).resolve().parents[1]

SOURCE = ROOT / "data/model-requests.json"

OUTPUT = ROOT / "number-request/requests.js"


try:

    data = json.loads(
        SOURCE.read_text(
            encoding="utf-8"
        )
    )

except Exception as exc:

    print(
        "WARNING:",
        exc
    )

    data = {
        "metric": "requests",
        "models": [],
        "history": []
    }


models = data.get(
    "models",
    []
)


if not isinstance(
    models,
    list
):

    models = []


weekly = data.get(
    "weekly",
    []
)


if not isinstance(
    weekly,
    list
):

    weekly = []


weekly = sorted(
    weekly,
    key=lambda item:
        int(
            item.get(
                "requests",
                0
            )
        ),
    reverse=True
)


# REQUEST_PERIOD_OBSERVATIONS_V1
observations = data.get(
    "observations",
    []
)

if not isinstance(
    observations,
    list
):
    observations = []

observations = sorted(
    observations,
    key=lambda item: (
        int(
            item.get(
                "periodHours",
                0
            )
            or 0
        ),
        -int(
            item.get(
                "requests",
                0
            )
            or 0
        )
    )
)


models.sort(
    key=lambda item:
        int(
            item.get(
                "requests",
                0
            )
        ),
    reverse=True
)


total = sum(
    int(
        item.get(
            "requests",
            0
        )
    )
    for item in models
)


for item in models:

    value = int(
        item.get(
            "requests",
            0
        )
    )

    item["share"] = (
        round(
            value / total * 100,
            4
        )
        if total
        else 0
    )


payload = {
    "updatedAt":
        data.get(
            "updatedAt"
        )
        or
        datetime.now()
        .astimezone()
        .isoformat(
            timespec="seconds"
        ),

    "metric":
        "requests",

    "unit":
        "requests",

    "period":
        data.get(
            "period",
            "current snapshot"
        ),

    "totalRequests":
        total,

    "models":
        models,

    "history":
        data.get(
            "history",
            []
        ),

    "observationsUpdatedAt":
        data.get(
            "observationsUpdatedAt"
        ),

    "observations":
        observations,

    "weekly":
        weekly
}


OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True
)


OUTPUT.write_text(
    "window.ZORIX_REQUEST_USAGE = "
    +
    json.dumps(
        payload,
        ensure_ascii=False,
        indent=2
    )
    +
    ";\n",
    encoding="utf-8"
)


print()
print(
    "REQUEST DATA BUILT"
)

print(
    "Models:",
    len(models)
)

print(
    "Total requests:",
    total
)

for index,item in enumerate(
    models,
    1
):

    print(
        index,
        item.get(
            "name"
        ),
        "=>",
        item.get(
            "requests"
        )
    )
