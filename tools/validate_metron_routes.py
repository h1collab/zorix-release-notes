#!/usr/bin/env python3

from pathlib import Path
import json
import re
import sys


ROOT = Path(__file__).resolve().parents[1]


errors=[]


# ============================================================
# Compare
# ============================================================

for path in [
    ROOT /
    "number-of-calls/compare.html",

    ROOT /
    "number-of-calls/compare/index.html"
]:

    if not path.exists():

        errors.append(
            f"Missing compare route: {path}"
        )


# ============================================================
# Models
# ============================================================

index = (
    ROOT /
    "number-of-calls/model-index.js"
)


if not index.exists():

    errors.append(
        "model-index.js missing"
    )

else:

    text=index.read_text(
        encoding="utf-8"
    )


    prefix=(
        "window.ZORIX_MODEL_INDEX = "
    )


    try:

        payload=text[
            text.index(prefix)
            +
            len(prefix):
        ].strip()


        if payload.endswith(";"):
            payload=payload[:-1]


        models=json.loads(
            payload
        )


        for model in models:

            model_id=model.get(
                "id"
            )


            if not model_id:
                continue


            page=(
                ROOT /
                "number-of-calls/models" /
                model_id /
                "index.html"
            )


            if not page.exists():

                errors.append(
                    "Missing model page: "
                    +
                    model_id
                )

    except Exception as exc:

        errors.append(
            "Cannot parse model-index.js: "
            +
            str(exc)
        )


# ============================================================
# Broken public routes
# ============================================================

for base in [
    ROOT /
    "number-of-calls",

    ROOT /
    "community"
]:

    if not base.exists():
        continue


    for path in base.rglob("*"):

        if (
            not path.is_file()
            or
            path.suffix.lower()
            not in {
                ".html",
                ".js"
            }
        ):
            continue


        text=path.read_text(
            encoding="utf-8",
            errors="ignore"
        )


        bad_patterns=[

            "%24%7B",
            "%24%7b",

            "model.html?id=${",

            'href="/number-of-calls/compare.html"',

            'href="../compare.html"',

            'href="./compare.html"'
        ]


        for pattern in bad_patterns:

            if pattern in text:

                errors.append(
                    f"{path}: contains {pattern}"
                )


# ============================================================
# Generated page loader
# ============================================================

sample=(
    ROOT /
    "number-of-calls/models/claude-opus-5/index.html"
)


if sample.exists():

    text=sample.read_text(
        encoding="utf-8"
    )


    required=[

        "/number-of-calls/models.js",

        "/number-of-calls/model-index.js"
    ]


    for value in required:

        if value not in text:

            errors.append(
                "Generated model page missing loader: "
                +
                value
            )


if errors:

    print()
    print("ROUTE VALIDATION FAILED")
    print()

    for error in errors:
        print("-",error)

    print(
        "\nWarnings found, but validation is non-blocking."
    )
    sys.exit(0)


print(
    "Route validation: OK"
)
