#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
import json
import sys

ROOT = Path(__file__).resolve().parents[1]

DATA = ROOT / "data" / "status.json"

BUILD = ROOT / "tools" / "build_status.py"


VALID = {
    "operational",
    "degraded",
    "partial_outage",
    "outage",
    "maintenance",
    "unknown",
}


def load():
    return json.loads(
        DATA.read_text(
            encoding="utf-8"
        )
    )


def save(data):

    DATA.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        ) + "\n",
        encoding="utf-8"
    )


def now():
    return (
        datetime.now()
        .astimezone()
        .isoformat(
            timespec="seconds"
        )
    )


if len(sys.argv) < 3:

    print(
        "Usage:\n"
        "  status_update.py all <status> [message]\n"
        "  status_update.py <component-id> <status> [message]\n"
        "  status_update.py incident <status> <title> [message]"
    )

    raise SystemExit(0)


target = sys.argv[1]

status = sys.argv[2]


if status not in VALID:

    print(
        "Unknown status:",
        status
    )

    print(
        "Allowed:",
        ", ".join(sorted(VALID))
    )

    raise SystemExit(0)


data = load()

timestamp = now()


if target == "all":

    message = (
        sys.argv[3]
        if len(sys.argv) > 3
        else ""
    )

    data["overall"] = status

    data["message"] = (
        message
        or (
            "All systems are operational."
            if status == "operational"
            else "System status updated."
        )
    )

    for component in data.get(
        "components",
        []
    ):
        component["status"] = status


elif target == "incident":

    title = (
        sys.argv[3]
        if len(sys.argv) > 3
        else "Service incident"
    )

    message = (
        sys.argv[4]
        if len(sys.argv) > 4
        else ""
    )

    data.setdefault(
        "incidents",
        []
    ).insert(
        0,
        {
            "title": title,
            "status": status,
            "message": message,
            "startedAt": timestamp,
            "resolvedAt": (
                timestamp
                if status == "operational"
                else None
            )
        }
    )

    data["overall"] = (
        "operational"
        if status == "operational"
        else status
    )

    data["message"] = title


else:

    message = (
        sys.argv[3]
        if len(sys.argv) > 3
        else ""
    )

    found = False

    for component in data.get(
        "components",
        []
    ):

        if component.get("id") == target:

            component["status"] = status

            if message:
                component[
                    "statusMessage"
                ] = message

            found = True
            break


    if not found:

        print(
            "Component not found:",
            target
        )

        print(
            "Available:"
        )

        for item in data.get(
            "components",
            []
        ):
            print(
                " ",
                item.get("id")
            )

        raise SystemExit(0)


    states = {
        item.get("status")
        for item in data.get(
            "components",
            []
        )
    }


    if "outage" in states:
        data["overall"] = "outage"

    elif "partial_outage" in states:
        data["overall"] = "partial_outage"

    elif "degraded" in states:
        data["overall"] = "degraded"

    elif "maintenance" in states:
        data["overall"] = "maintenance"

    elif states == {"operational"}:
        data["overall"] = "operational"

    else:
        data["overall"] = "unknown"


data["updatedAt"] = timestamp

save(data)


import subprocess

subprocess.run(
    [
        sys.executable,
        str(BUILD)
    ],
    check=False
)


print()
print("ZORIX STATUS")
print("------------")
print("Overall:", data["overall"])
print("Updated:", timestamp)
