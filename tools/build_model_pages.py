#!/usr/bin/env python3

from pathlib import Path
import json
import re
import shutil


ROOT = Path(__file__).resolve().parents[1]

TEMPLATE = (
    ROOT /
    "number-of-calls/model-detail-template.html"
)

INDEX = (
    ROOT /
    "number-of-calls/model-index.js"
)

MODELS_DIR = (
    ROOT /
    "number-of-calls/models"
)


text=INDEX.read_text(
    encoding="utf-8"
)


prefix=(
    "window.ZORIX_MODEL_INDEX = "
)


payload=text[
    text.index(prefix)+len(prefix):
].strip()


if payload.endswith(";"):
    payload=payload[:-1]


models=json.loads(payload)


template=TEMPLATE.read_text(
    encoding="utf-8"
)


# Delete only generated model directories.
for child in MODELS_DIR.iterdir():

    if (
        child.is_dir()
        and
        (
            child /
            ".zorix-generated-model"
        ).exists()
    ):

        shutil.rmtree(
            child
        )


count=0


for model in models:

    model_id=model.get(
        "id"
    )


    if not model_id:
        continue


    page=template.replace(
        "__MODEL_ROUTE_ID__",
        model_id
    )


    # Generated page lives at:
    # /number-of-calls/models/<id>/
    #
    # Always use absolute static routes so nested model URLs
    # cannot break script loading.
    page=re.sub(
        r'''(src=["'])\./([^"']+)''',
        r'''\1/number-of-calls/\2''',
        page
    )


    # Convert local navigation to stable absolute routes.
    page=page.replace(
        'href="./models/"',
        'href="/number-of-calls/models/"'
    )

    page=page.replace(
        'href="./compare.html"',
        'href="/number-of-calls/compare/"'
    )

    page=page.replace(
        'href="./explore/"',
        'href="/number-of-calls/explore/"'
    )

    page=page.replace(
        'href="./"',
        'href="/number-of-calls/"'
    )


    outdir=(
        MODELS_DIR /
        model_id
    )


    outdir.mkdir(
        parents=True,
        exist_ok=True
    )


    (
        outdir /
        "index.html"
    ).write_text(
        page,
        encoding="utf-8"
    )


    (
        outdir /
        ".zorix-generated-model"
    ).write_text(
        model_id+"\n",
        encoding="utf-8"
    )


    count+=1


print(
    "Generated",
    count,
    "path-based model pages."
)
