#!/usr/bin/env python3

from pathlib import Path
import json
import shutil


ROOT = Path(__file__).resolve().parents[1]

SOURCE = ROOT / "data/translate-models.json"
TARGET_JS = ROOT / "translate/translate.js"
TEMPLATE = ROOT / "translate/model-detail-template.html"
MODELS_DIR = ROOT / "translate/models"


def load_json(path):
    return json.loads(
        path.read_text(
            encoding="utf-8"
        )
    )


def write_text(path, text):
    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    path.write_text(
        text,
        encoding="utf-8"
    )


data = load_json(
    SOURCE
)

models = data.get(
    "models",
    []
)

score_base = int(
    data.get(
        "scoreBase",
        1000
    )
)


score_order = sorted(
    models,
    key=lambda item:
        int(
            item.get(
                "score",
                score_base
            )
        ),
    reverse=True
)


request_order = sorted(
    models,
    key=lambda item:
        int(
            item.get(
                "requests5h",
                0
            )
        ),
    reverse=True
)


score_rank = {
    item["id"]: index
    for index,item
    in enumerate(
        score_order,
        1
    )
}


request_rank = {
    item["id"]: index
    for index,item
    in enumerate(
        request_order,
        1
    )
}


for item in models:

    item["scoreDelta"] = (
        int(
            item.get(
                "score",
                score_base
            )
        )
        -
        score_base
    )

    item["scoreRank"] = (
        score_rank[
            item["id"]
        ]
    )

    item["requestRank"] = (
        request_rank[
            item["id"]
        ]
    )


payload = {
    **data,
    "models": models
}


write_text(
    TARGET_JS,
    (
        "window.ZORIX_TRANSLATE = "
        +
        json.dumps(
            payload,
            ensure_ascii=False,
            indent=2
        )
        +
        ";\n"
    )
)


template = TEMPLATE.read_text(
    encoding="utf-8"
)


MODELS_DIR.mkdir(
    parents=True,
    exist_ok=True
)


for child in MODELS_DIR.iterdir():

    if (
        child.is_dir()
        and
        (
            child /
            ".zorix-generated-translate-model"
        ).exists()
    ):

        shutil.rmtree(
            child
        )


for item in models:

    model_id = item["id"]

    folder = (
        MODELS_DIR /
        model_id
    )

    folder.mkdir(
        parents=True,
        exist_ok=True
    )

    page = template.replace(
        "__TRANSLATE_MODEL_ID__",
        model_id
    )

    write_text(
        folder /
        "index.html",
        page
    )

    write_text(
        folder /
        ".zorix-generated-translate-model",
        model_id + "\n"
    )


print()
print("ZORIX TRANSLATE BUILT")
print("Models:", len(models))
print("Score base:", score_base)

for item in score_order:

    print(
        "#",
        score_rank[item["id"]],
        item["name"],
        "| score",
        item["score"],
        "| requests/5h",
        item["requests5h"]
    )
