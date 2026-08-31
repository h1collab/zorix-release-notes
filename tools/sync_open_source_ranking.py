#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.parse import urlencode, quote
import json
import re


ROOT = Path(__file__).resolve().parents[1]

DATA_FILE = (
    ROOT /
    "data/open-source-ranking.json"
)

JS_FILE = (
    ROOT /
    "open-source/ranking/ranking.js"
)

REPORT_FILE = (
    ROOT /
    "data/open-source-ranking-sync.json"
)

HF_API = "https://huggingface.co/api/models"

USER_AGENT = (
    "Zorix-Open-Source-Ranking/1.0 "
    "(https://updates.zorix.it/)"
)

FEATURED_ID = (
    "Zorix-official/"
    "Zorix-Nano-0.8B-GGUF"
)


def now():
    return (
        datetime.now()
        .astimezone()
        .isoformat(
            timespec="seconds"
        )
    )


def load_json(path, default):
    try:
        return json.loads(
            path.read_text(
                encoding="utf-8"
            )
        )
    except Exception:
        return default


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


def get_json(url):

    request = Request(
        url,
        headers={
            "User-Agent":
                USER_AGENT,

            "Accept":
                "application/json"
        }
    )

    with urlopen(
        request,
        timeout=30
    ) as response:

        return json.loads(
            response
            .read()
            .decode("utf-8")
        )


def fetch_models(sort):

    query = urlencode(
        {
            "sort": sort,
            "direction": "-1",
            "limit": "140",
            "full": "true",
            "config": "true",
            "cardData": "true"
        }
    )

    payload = get_json(
        HF_API
        +
        "?"
        +
        query
    )

    return (
        payload
        if isinstance(
            payload,
            list
        )
        else []
    )


def fetch_model(model_id):

    return get_json(
        HF_API
        +
        "/"
        +
        quote(
            model_id,
            safe="/"
        )
    )


def tags(model):

    value = model.get(
        "tags",
        []
    )

    return (
        value
        if isinstance(
            value,
            list
        )
        else []
    )


def card(model):

    value = model.get(
        "cardData"
    )

    return (
        value
        if isinstance(
            value,
            dict
        )
        else {}
    )


def license_name(model):

    info = card(model)

    value = info.get(
        "license"
    )

    if isinstance(
        value,
        list
    ):
        value = (
            value[0]
            if value
            else ""
        )

    if value:
        return str(value)

    for tag in tags(model):

        if str(tag).startswith(
            "license:"
        ):
            return str(tag).split(
                ":",
                1
            )[1]

    return ""


def is_gated(model):

    value = model.get(
        "gated"
    )

    return (
        value
        not in (
            None,
            False,
            "",
            "false",
            "False"
        )
    )


def is_language_model(model):

    pipeline = str(
        model.get(
            "pipeline_tag",
            ""
        )
    ).lower()

    model_tags = {
        str(x).lower()
        for x in tags(model)
    }

    allowed = {
        "text-generation",
        "text2text-generation",
        "conversational",
        "image-text-to-text"
    }

    if pipeline in allowed:
        return True

    signals = {
        "text-generation",
        "conversational",
        "gguf",
        "llama.cpp"
    }

    return bool(
        model_tags
        &
        signals
    )


def is_open_listing(model):

    if model.get(
        "private"
    ):
        return False

    if model.get(
        "disabled"
    ):
        return False

    if is_gated(model):
        return False

    if not license_name(model):
        return False

    if not is_language_model(model):
        return False

    return True


def language_list(model):

    value = card(model).get(
        "language",
        []
    )

    if isinstance(
        value,
        str
    ):
        value = [value]

    if not isinstance(
        value,
        list
    ):
        value = []

    output = []

    aliases = {
        "en": "English",
        "zh": "Chinese",
        "zh-cn": "Chinese",
        "it": "Italian",
        "fr": "French",
        "de": "German",
        "es": "Spanish",
        "ja": "Japanese",
        "ko": "Korean",
        "ru": "Russian",
        "ar": "Arabic",
        "pt": "Portuguese"
    }

    for item in value:

        text = str(item)

        output.append(
            aliases.get(
                text.lower(),
                text
            )
        )

    if (
        model.get("id")
        ==
        FEATURED_ID
        and
        not output
    ):
        return [
            "Chinese",
            "English",
            "Italian"
        ]

    return output[:8]


def model_formats(model):

    found = []

    model_tags = [
        str(x).lower()
        for x in tags(model)
    ]

    mapping = [
        ("gguf", "GGUF"),
        ("safetensors", "Safetensors"),
        ("transformers", "Transformers"),
        ("pytorch", "PyTorch"),
        ("mlx", "MLX"),
        ("onnx", "ONNX")
    ]

    for needle, label in mapping:

        if any(
            needle in tag
            for tag in model_tags
        ):
            found.append(
                label
            )

    siblings = model.get(
        "siblings",
        []
    )

    if isinstance(
        siblings,
        list
    ):

        names = [
            str(
                item.get(
                    "rfilename",
                    ""
                )
            ).lower()
            for item in siblings
            if isinstance(
                item,
                dict
            )
        ]

        if (
            any(
                x.endswith(
                    ".gguf"
                )
                for x in names
            )
            and
            "GGUF"
            not in found
        ):
            found.append(
                "GGUF"
            )

        if (
            any(
                x.endswith(
                    ".safetensors"
                )
                for x in names
            )
            and
            "Safetensors"
            not in found
        ):
            found.append(
                "Safetensors"
            )

    if (
        model.get("id")
        ==
        FEATURED_ID
        and
        "GGUF"
        not in found
    ):
        found.insert(
            0,
            "GGUF"
        )

    return found[:4]


def parameter_count(model):

    safetensors = model.get(
        "safetensors"
    )

    if isinstance(
        safetensors,
        dict
    ):

        value = safetensors.get(
            "total"
        )

        try:
            if value:
                return int(value)
        except Exception:
            pass

    config = model.get(
        "config"
    )

    if isinstance(
        config,
        dict
    ):

        for key in (
            "num_parameters",
            "n_parameters",
            "parameter_count"
        ):

            value = config.get(
                key
            )

            try:
                if value:
                    return int(value)
            except Exception:
                pass

    if (
        model.get("id")
        ==
        FEATURED_ID
    ):
        return 800_000_000

    return None


def architecture(model):

    config = model.get(
        "config"
    )

    if isinstance(
        config,
        dict
    ):

        architectures = (
            config.get(
                "architectures"
            )
        )

        if (
            isinstance(
                architectures,
                list
            )
            and
            architectures
        ):
            return str(
                architectures[0]
            )

        model_type = config.get(
            "model_type"
        )

        if model_type:
            return str(
                model_type
            )

    if (
        model.get("id")
        ==
        FEATURED_ID
    ):
        return "zorix-nano"

    return ""


def display_tags(model):

    ignore_prefix = (
        "license:",
        "language:",
        "arxiv:",
        "doi:",
        "base_model:"
    )

    ignore_exact = {
        "transformers",
        "pytorch",
        "safetensors"
    }

    output = []

    for item in tags(model):

        text = str(item)

        lower = text.lower()

        if lower.startswith(
            ignore_prefix
        ):
            continue

        if lower in ignore_exact:
            continue

        if text not in output:
            output.append(
                text
            )

        if len(output) >= 9:
            break

    return output


def normalize(model):

    model_id = str(
        model.get(
            "id",
            ""
        )
    )

    if not model_id:
        return None

    if "/" in model_id:
        author, name = (
            model_id.split(
                "/",
                1
            )
        )
    else:
        author = str(
            model.get(
                "author",
                ""
            )
        )
        name = model_id

    return {
        "id":
            model_id,

        "author":
            author,

        "name":
            name,

        "url":
            (
                "https://huggingface.co/"
                +
                model_id
            ),

        "downloads":
            int(
                model.get(
                    "downloads",
                    0
                )
                or
                0
            ),

        "likes":
            int(
                model.get(
                    "likes",
                    0
                )
                or
                0
            ),

        "trendingScore":
            float(
                model.get(
                    "trendingScore",
                    0
                )
                or
                0
            ),

        "license":
            license_name(
                model
            ),

        "languages":
            language_list(
                model
            ),

        "formats":
            model_formats(
                model
            ),

        "parameters":
            parameter_count(
                model
            ),

        "architecture":
            architecture(
                model
            ),

        "pipeline":
            model.get(
                "pipeline_tag"
            )
            or
            "",

        "library":
            model.get(
                "library_name"
            )
            or
            "",

        "tags":
            display_tags(
                model
            ),

        "createdAt":
            model.get(
                "createdAt"
            )
            or
            "",

        "lastModified":
            model.get(
                "lastModified"
            )
            or
            "",

        "featured":
            model_id
            ==
            FEATURED_ID
    }


previous = load_json(
    DATA_FILE,
    {
        "models": []
    }
)

previous_map = {
    item.get("id"): item
    for item in previous.get(
        "models",
        []
    )
    if isinstance(
        item,
        dict
    )
    and
    item.get("id")
}


all_models = {}
errors = []


for sort in (
    "trendingScore",
    "downloads",
    "likes"
):

    try:

        result = fetch_models(
            sort
        )

        for item in result:

            if not isinstance(
                item,
                dict
            ):
                continue

            model_id = item.get(
                "id"
            )

            if model_id:
                all_models[
                    model_id
                ] = item

        print(
            sort,
            "=>",
            len(result)
        )

    except Exception as exc:

        errors.append(
            {
                "source":
                    sort,
                "error":
                    str(exc)
            }
        )

        print(
            "WARNING:",
            sort,
            exc
        )


# Always include Zorix Nano even when
# it is outside the global top lists.

try:

    featured = fetch_model(
        FEATURED_ID
    )

    if isinstance(
        featured,
        dict
    ):
        all_models[
            FEATURED_ID
        ] = featured

except Exception as exc:

    errors.append(
        {
            "source":
                FEATURED_ID,
            "error":
                str(exc)
        }
    )


if not all_models:

    if DATA_FILE.exists():

        print()
        print(
            "No fresh Hub data returned."
        )

        print(
            "Existing ranking data was preserved."
        )

    else:

        write_json(
            DATA_FILE,
            {
                "updatedAt":
                    now(),

                "source":
                    "Hugging Face Hub API",

                "models":
                    []
            }
        )

        JS_FILE.write_text(
            "window.ZORIX_OPEN_SOURCE_RANKING = "
            +
            json.dumps(
                load_json(
                    DATA_FILE,
                    {}
                ),
                ensure_ascii=False,
                indent=2
            )
            +
            ";\n",
            encoding="utf-8"
        )

else:

    normalized = []

    for item in all_models.values():

        if not is_open_listing(
            item
        ):
            continue

        row = normalize(
            item
        )

        if row:
            normalized.append(
                row
            )


    normalized.sort(
        key=lambda item: (
            -float(
                item.get(
                    "trendingScore",
                    0
                )
            ),
            -int(
                item.get(
                    "downloads",
                    0
                )
            ),
            item.get(
                "id",
                ""
            )
        )
    )


    # Keep broad top rankings plus the
    # separately fetched Zorix model.
    selected = normalized[:100]

    featured_row = next(
        (
            item
            for item in normalized
            if item.get(
                "id"
            )
            ==
            FEATURED_ID
        ),
        None
    )

    if (
        featured_row
        and
        not any(
            item.get("id")
            ==
            FEATURED_ID
            for item in selected
        )
    ):
        selected.append(
            featured_row
        )


    sync_time = now()


    for item in selected:

        old = previous_map.get(
            item["id"],
            {}
        )

        history = old.get(
            "history",
            []
        )

        if not isinstance(
            history,
            list
        ):
            history = []

        snapshot = {
            "at":
                sync_time,

            "downloads":
                item["downloads"],

            "likes":
                item["likes"],

            "trendingScore":
                item["trendingScore"]
        }


        last = (
            history[-1]
            if history
            and
            isinstance(
                history[-1],
                dict
            )
            else None
        )


        if (
            not last
            or
            last.get("downloads")
            !=
            snapshot["downloads"]
            or
            last.get("likes")
            !=
            snapshot["likes"]
            or
            last.get("trendingScore")
            !=
            snapshot["trendingScore"]
        ):

            history.append(
                snapshot
            )


        item["history"] = (
            history[-60:]
        )


    output = {
        "updatedAt":
            sync_time,

        "source":
            "Hugging Face Hub API",

        "sourceUrl":
            "https://huggingface.co/models",

        "methodology":
            (
                "Public, non-gated language-model repositories "
                "with published license metadata. "
                "Ranking can be sorted by Hub trending score, "
                "downloads in the rolling 30-day window or likes."
            ),

        "featuredModel":
            FEATURED_ID,

        "models":
            selected
    }


    write_json(
        DATA_FILE,
        output
    )


    JS_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    JS_FILE.write_text(
        "window.ZORIX_OPEN_SOURCE_RANKING = "
        +
        json.dumps(
            output,
            ensure_ascii=False,
            indent=2
        )
        +
        ";\n",
        encoding="utf-8"
    )


report = {
    "updatedAt":
        now(),

    "fetched":
        len(all_models),

    "published":
        len(
            load_json(
                DATA_FILE,
                {}
            ).get(
                "models",
                []
            )
        ),

    "errors":
        errors
}


write_json(
    REPORT_FILE,
    report
)


print()
print(
    "OPEN SOURCE RANKING SYNC"
)
print(
    "------------------------"
)
print(
    "Fetched:",
    report["fetched"]
)
print(
    "Published:",
    report["published"]
)
print(
    "Warnings:",
    len(errors)
)
print()
print(
    "Built:",
    DATA_FILE
)
print(
    "Built:",
    JS_FILE
)
