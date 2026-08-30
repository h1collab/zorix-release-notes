#!/usr/bin/env python3

import json
import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent

DATA = ROOT / "data" / "public-quota.json"
OUTPUT = ROOT / "number-of-calls" / "quota.js"


def parse_amount(value):
    value = value.strip().upper().replace(",", "")

    multipliers = {
        "K": 1_000,
        "M": 1_000_000,
        "B": 1_000_000_000,
        "T": 1_000_000_000_000,
        "P": 1_000_000_000_000_000,
    }

    if value[-1:] in multipliers:
        return int(float(value[:-1]) * multipliers[value[-1]])

    return int(value)


if len(sys.argv) < 3:
    print("Usage: quota_update.py <official|realtime> <amount> [note]")
    sys.exit(1)

kind = sys.argv[1]
amount = parse_amount(sys.argv[2])
note = sys.argv[3] if len(sys.argv) > 3 else ""

if amount <= 0:
    raise SystemExit("Amount must be greater than 0.")

if DATA.exists():
    data = json.loads(DATA.read_text(encoding="utf-8"))
else:
    data = {
        "unit": "tokens",
        "current": 0,
        "totalIssued": 0,
        "updatedAt": None,
        "history": []
    }

now = datetime.now().astimezone().isoformat(timespec="seconds")

data["current"] = int(data.get("current", 0)) + amount
data["totalIssued"] = int(data.get("totalIssued", 0)) + amount
data["updatedAt"] = now

data.setdefault("history", []).insert(0, {
    "type": kind,
    "amount": amount,
    "note": note,
    "timestamp": now
})

# Keep most recent 100 events.
data["history"] = data["history"][:100]

DATA.write_text(
    json.dumps(data, ensure_ascii=False, indent=2),
    encoding="utf-8"
)

OUTPUT.write_text(
    "window.ZORIX_PUBLIC_QUOTA = " +
    json.dumps(data, ensure_ascii=False, indent=2) +
    ";\n",
    encoding="utf-8"
)

print()
print("ZORIX CODE PUBLIC QUOTA")
print("-----------------------")
print(f"Added:          {amount:,} tokens")
print(f"Current quota:  {data['current']:,} tokens")
print(f"Total issued:   {data['totalIssued']:,} tokens")
print()
