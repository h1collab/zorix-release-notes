#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
import json
import sys


ROOT = Path(__file__).resolve().parents[1]

DATA = ROOT / "data/public-quota.json"

OUTPUT = ROOT / "number-of-calls/quota.js"


def parse_amount(value):

    value = (
        str(value)
        .strip()
        .upper()
        .replace(",", "")
    )

    if not value:
        raise ValueError(
            "Usage amount is empty."
        )

    multipliers = {
        "K": 1_000,
        "M": 1_000_000,
        "B": 1_000_000_000,
        "T": 1_000_000_000_000,
        "P": 1_000_000_000_000_000,
    }

    suffix = value[-1]

    if suffix in multipliers:

        number = float(
            value[:-1]
        )

        return int(
            number *
            multipliers[suffix]
        )

    return int(
        float(value)
    )


def load():

    if DATA.exists():

        data = json.loads(
            DATA.read_text(
                encoding="utf-8"
            )
        )

    else:

        data = {}


    data.setdefault(
        "unit",
        "tokens"
    )

    data.setdefault(
        "totalIssued",
        0
    )

    data.setdefault(
        "totalConsumed",
        0
    )

    data.setdefault(
        "observedUsageTotal",
        0
    )

    data.setdefault(
        "current",
        0
    )

    data.setdefault(
        "history",
        []
    )

    return data


def save(data):

    DATA.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        )
        + "\n",
        encoding="utf-8"
    )


    OUTPUT.write_text(
        "window.ZORIX_PUBLIC_QUOTA = "
        + json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        )
        + ";\n",
        encoding="utf-8"
    )


if len(sys.argv) < 2:

    print(
        "Usage: quota_sync.py "
        "<cumulative-public-usage> "
        "[note]"
    )

    raise SystemExit(1)


new_meter = parse_amount(
    sys.argv[1]
)


note = (
    sys.argv[2]
    if len(sys.argv) > 2
    else "Public usage"
)


if new_meter < 0:

    raise SystemExit(
        "Usage meter cannot be negative."
    )


data = load()


previous_meter = int(
    data.get(
        "observedUsageTotal",
        0
    )
)


if new_meter < previous_meter:

    raise SystemExit(
        "Cumulative usage cannot decrease. "
        f"Previous meter: {previous_meter:,}; "
        f"new meter: {new_meter:,}."
    )


delta = (
    new_meter -
    previous_meter
)


now = (
    datetime.now()
    .astimezone()
    .isoformat(
        timespec="seconds"
    )
)


if delta > 0:

    data["totalConsumed"] = (
        int(
            data.get(
                "totalConsumed",
                0
            )
        )
        +
        delta
    )


data[
    "observedUsageTotal"
] = new_meter


data["current"] = max(
    0,
    int(
        data.get(
            "totalIssued",
            0
        )
    )
    -
    int(
        data.get(
            "totalConsumed",
            0
        )
    )
)


data["updatedAt"] = now


if delta > 0:

    data.setdefault(
        "history",
        []
    ).insert(
        0,
        {
            "type":
                "consume",

            "amount":
                delta,

            "direction":
                "debit",

            "remaining":
                data["current"],

            "issued":
                int(
                    data.get(
                        "totalIssued",
                        0
                    )
                ),

            "consumed":
                int(
                    data.get(
                        "totalConsumed",
                        0
                    )
                ),

            "observedUsageTotal":
                new_meter,

            "note":
                note,

            "timestamp":
                now
        }
    )


data["history"] = (
    data.get(
        "history",
        []
    )[:500]
)


save(data)


print()
print(
    "PUBLIC QUOTA USAGE SYNC"
)

print(
    "-----------------------"
)

print(
    f"Previous meter: {previous_meter:,}"
)

print(
    f"Current meter:  {new_meter:,}"
)

print(
    f"New usage:      {delta:,}"
)

print(
    f"Total consumed: "
    f"{data['totalConsumed']:,}"
)

print(
    f"Remaining:      "
    f"{data['current']:,}"
)

if delta == 0:

    print()
    print(
        "No additional usage detected."
    )

print()
