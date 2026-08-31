#!/usr/bin/env python3

import json
import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent

DATA = ROOT / "data" / "public-quota.json"
OUTPUT = ROOT / "number-of-calls" / "quota.js"


def parse_amount(value):
    value = (
        value
        .strip()
        .upper()
        .replace(",", "")
    )

    multipliers = {
        "K": 1_000,
        "M": 1_000_000,
        "B": 1_000_000_000,
        "T": 1_000_000_000_000,
        "P": 1_000_000_000_000_000,
    }

    if value[-1:] in multipliers:
        return int(
            float(value[:-1]) *
            multipliers[value[-1]]
        )

    return int(value)


def load():
    if DATA.exists():
        data = json.loads(
            DATA.read_text(
                encoding="utf-8"
            )
        )
    else:
        data = {}

    data.setdefault("unit", "tokens")
    data.setdefault("current", 0)
    data.setdefault("totalIssued", 0)
    data.setdefault("totalConsumed", 0)
    data.setdefault("observedUsageTotal", 0)
    data.setdefault("updatedAt", None)
    data.setdefault("history", [])

    return data


def save(data):
    DATA.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        ) + "\n",
        encoding="utf-8"
    )

    OUTPUT.write_text(
        "window.ZORIX_PUBLIC_QUOTA = " +
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        ) +
        ";\n",
        encoding="utf-8"
    )


if len(sys.argv) < 3:
    print(
        "Usage: quota_update.py "
        "<official|realtime> "
        "<amount> [note]"
    )
    sys.exit(1)


kind = sys.argv[1]

if kind not in {
    "official",
    "realtime"
}:
    raise SystemExit(
        "Type must be official or realtime."
    )


amount = parse_amount(
    sys.argv[2]
)

note = (
    sys.argv[3]
    if len(sys.argv) > 3
    else ""
)


if amount <= 0:
    raise SystemExit(
        "Amount must be greater than 0."
    )


data = load()

now = (
    datetime.now()
    .astimezone()
    .isoformat(
        timespec="seconds"
    )
)


data["totalIssued"] = (
    int(
        data.get(
            "totalIssued",
            0
        )
    )
    +
    amount
)


data["current"] = max(
    0,
    int(
        data["totalIssued"]
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


data.setdefault(
    "history",
    []
).insert(
    0,
    {
        "type": kind,
        "amount": amount,
        "direction": "credit",
        "remaining": data["current"],
        "issued": data["totalIssued"],
        "consumed": data.get(
            "totalConsumed",
            0
        ),
        "note": note,
        "timestamp": now
    }
)


data["history"] = (
    data["history"][:500]
)


save(data)


print()
print("ZORIX PUBLIC QUOTA")
print("------------------")
print(
    f"Added:          {amount:,}"
)
print(
    f"Total issued:   {data['totalIssued']:,}"
)
print(
    f"Total consumed: {data.get('totalConsumed',0):,}"
)
print(
    f"Remaining:      {data['current']:,}"
)
print()
