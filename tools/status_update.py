#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
import subprocess
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
    "maintenance"
}


def now():
    return (
        datetime.now()
        .astimezone()
        .isoformat(
            timespec="seconds"
        )
    )


def load():
    return json.loads(
        DATA.read_text(
            encoding="utf-8"
        )
    )


def save(data):

    data["updatedAt"] = now()

    DATA.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        ) + "\n",
        encoding="utf-8"
    )

    subprocess.run(
        [
            sys.executable,
            str(BUILD)
        ],
        check=False
    )


if len(sys.argv) < 3:

    print()
    print("Examples:")
    print(
        'statusctl all operational '
        '"All systems operational"'
    )
    print(
        'statusctl zorix-api degraded '
        '"Elevated latency"'
    )
    print(
        'statusctl incident degraded '
        '"Elevated API latency" '
        '"We are investigating."'
    )
    print()

    raise SystemExit(0)


target = sys.argv[1]
state = sys.argv[2]


if state not in VALID:

    print("Unknown state:", state)
    print("Allowed:", ", ".join(sorted(VALID)))
    raise SystemExit(0)


data = load()


if target == "all":

    message = (
        sys.argv[3]
        if len(sys.argv) > 3
        else (
            "All Zorix systems are operating normally."
            if state == "operational"
            else "Zorix system status has changed."
        )
    )

    data["overall"] = state
    data["message"] = message

    for component in data.get(
        "components",
        []
    ):
        component["status"] = state


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
            "status": state,
            "message": message,
            "startedAt": now(),
            "resolvedAt": (
                now()
                if state == "operational"
                else None
            )
        }
    )

    data["overall"] = state
    data["message"] = title


else:

    found = False

    for component in data.get(
        "components",
        []
    ):

        if component.get("id") == target:

            component["status"] = state

            if len(sys.argv) > 3:
                component["statusMessage"] = sys.argv[3]

            found = True
            break


    if not found:

        print(
            "Unknown component:",
            target
        )

        print("Available:")

        for component in data.get(
            "components",
            []
        ):
            print(
                " ",
                component.get("id")
            )

        raise SystemExit(0)


    states = {
        component.get("status")
        for component in data.get(
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

    else:
        data["overall"] = "operational"


    if data["overall"] == "operational":

        data["message"] = (
            "All Zorix systems are operating normally."
        )

    else:

        data["message"] = (
            "Some Zorix systems are currently experiencing issues."
        )


save(data)


print()
print("ZORIX STATUS UPDATED")
print("--------------------")
print("Overall:", data["overall"])
print("Updated:", data["updatedAt"])
print()
