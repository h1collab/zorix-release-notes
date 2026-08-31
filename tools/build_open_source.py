#!/usr/bin/env python3

from pathlib import Path
import json
import shutil


ROOT = Path(__file__).resolve().parents[1]

SOURCE = ROOT / "data/open-source-models.json"

OUTPUT = ROOT / "data/open-source-ranking.json"

JS = ROOT / "open-source/open-source.js"

LEGACY_JS = ROOT / "open-source/ranking/ranking.js"

TEMPLATE = ROOT / "tools/open_source_model_template.html"

MODELS_ROOT = ROOT / "open-source/models"


def load_json(path):
    return json.loads(
        path.read_text(
            encoding="utf-8"
        )
    )


def write_json(path, data):
    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    path.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        )
        +
        "\n",
        encoding="utf-8"
    )


try:

    source = load_json(
        SOURCE
    )

except Exception as exc:

    print(
        "BUILD ERROR:",
        exc
    )

    source = {
        "dataAsOf": "",
        "owner": "Zorix",
        "models": []
    }


models = source.get(
    "models",
    []
)


if not isinstance(
    models,
    list
):

    models = []


clean = []


for item in models:

    if not isinstance(
        item,
        dict
    ):
        continue


    if item.get(
        "owner"
    ) != "Zorix":

        print(
            "IGNORED NON-ZORIX MODEL:",
            item.get(
                "name",
                "unknown"
            )
        )

        continue


    if not item.get(
        "slug"
    ):

        print(
            "IGNORED MODEL WITHOUT SLUG:",
            item.get(
                "name",
                "unknown"
            )
        )

        continue


    item["logo"] = (
        "/number-of-calls/assets/"
        "logos/zorix.svg"
    )

    clean.append(
        item
    )


output = {
    "dataAsOf":
        source.get(
            "dataAsOf",
            ""
        ),

    "owner":
        "Zorix",

    "registry":
        "Zorix Open Source",

    "models":
        clean
}


write_json(
    OUTPUT,
    output
)


js_text = (
    "window.ZORIX_OPEN_SOURCE = "
    +
    json.dumps(
        output,
        ensure_ascii=False,
        indent=2
    )
    +
    ";\n"
)


JS.parent.mkdir(
    parents=True,
    exist_ok=True
)


JS.write_text(
    js_text,
    encoding="utf-8"
)


LEGACY_JS.parent.mkdir(
    parents=True,
    exist_ok=True
)


LEGACY_JS.write_text(
    js_text,
    encoding="utf-8"
)


MODELS_ROOT.mkdir(
    parents=True,
    exist_ok=True
)


for child in list(
    MODELS_ROOT.iterdir()
):

    if child.is_dir():

        shutil.rmtree(
            child
        )


try:

    template = TEMPLATE.read_text(
        encoding="utf-8"
    )

except Exception as exc:

    print(
        "TEMPLATE ERROR:",
        exc
    )

    template = ""


generated = 0


if template:

    for item in clean:

        slug = item["slug"]

        folder = (
            MODELS_ROOT /
            slug
        )

        folder.mkdir(
            parents=True,
            exist_ok=True
        )

        page = template.replace(
            "__MODEL_SLUG__",
            slug
        )

        (
            folder /
            "index.html"
        ).write_text(
            page,
            encoding="utf-8"
        )

        (
            folder /
            ".zorix-generated-open-source"
        ).write_text(
            "generated\n",
            encoding="utf-8"
        )

        generated += 1


print()
print(
    "ZORIX OPEN SOURCE BUILD"
)

print(
    "Models:",
    len(clean)
)

print(
    "Detail pages:",
    generated
)

print(
    "Third-party models: 0"
)

for item in clean:

    print(
        "-",
        item.get(
            "name"
        ),
        "|",
        item.get(
            "downloadsLastMonth"
        ),
        "downloads",
        "|",
        item.get(
            "likes"
        ),
        "likes"
    )
