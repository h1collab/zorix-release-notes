#!/usr/bin/env python3

import json
import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent

DATA = (
    ROOT /
    "data" /
    "public-quota.json"
)

OUTPUT = (
    ROOT /
    "number-of-calls" /
    "quota.js"
)


def parse_amount(value):
    value = (
        value
        .strip()
        .upper()
        .replace(",", "")
    )

    units = {
        "K": 1_000,
        "M": 1_000_000,
        "B": 1_000_000_000,
        "T": 1_000_000_000_000,
        "P": 1_000_000_000_000_000,
    }

    if value[-1:] in units:
        return int(
            float(
                value[:-1]
            ) *
            units[
                value[-1]
            ]
        )

    return int(value)


if len(sys.argv) < 2:
    print(
        "Usage: quota_sync.py "
        "<cumulative-public-tokens-used> "
        "[note]"
    )
    sys.exit(1)


observed = parse_amount(
    sys.argv[1]
)

note = (
    sys.argv[2]
    if len(sys.argv) > 2
    else "Metron public quota usage"
)


data = json.loads(
    DATA.read_text(
        encoding="utf-8"
    )
)


previous = int(
    data.get(
        "observedUsageTotal",
        0
    )
)


if observed < previous:
    raise SystemExit(
        "Observed cumulative usage is lower "
        "than the previous counter.\n"
        "Do not silently reset a cumulative meter."
    )


delta = (
    observed -
    previous
)


if delta == 0:
    print(
        "No new public quota consumption."
    )
    raise SystemExit(0)


issued = int(
    data.get(
        "totalIssued",
        0
    )
)


consumed = int(
    data.get(
        "totalConsumed",
        0
    )
)


consumed += delta


remaining = max(
    0,
    issued -
    consumed
)


now = (
    datetime.now()
    .astimezone()
    .isoformat(
        timespec="seconds"
    )
)


data["observedUsageTotal"] = observed

data["totalConsumed"] = consumed

data["current"] = remaining

data["updatedAt"] = now


data.setdefault(
    "history",
    []
).insert(
    0,
    {
        "type": "consume",
        "amount": delta,
        "direction": "debit",
        "remaining": remaining,
        "issued": issued,
        "consumed": consumed,
        "observedUsageTotal": observed,
        "note": note,
        "timestamp": now
    }
)


data["history"] = (
    data["history"][:500]
)


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


print()
print("PUBLIC QUOTA USAGE SYNC")
print("-----------------------")
print(
    f"Previous meter: {previous:,}"
)
print(
    f"Current meter:  {observed:,}"
)
print(
    f"New usage:      {delta:,}"
)
print(
    f"Remaining:      {remaining:,}"
)
print()
