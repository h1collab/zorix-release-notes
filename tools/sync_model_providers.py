#!/usr/bin/env python3

from pathlib import Path
from datetime import datetime, timedelta
from urllib.request import Request, urlopen
from urllib.parse import quote
import json
import re

ROOT = Path(__file__).resolve().parents[1]

MAP_FILE = ROOT / "data/model-provider-map.json"
PRICING_FILE = ROOT / "data/model-pricing.json"

DATA_OUT = ROOT / "data/model-providers.json"
JS_OUT = ROOT / "number-of-calls/model-providers.js"
REPORT = ROOT / "data/model-provider-sync-report.json"

MODEL_INDEX = ROOT / "number-of-calls/model-index.js"

API_ROOT = "https://openrouter.ai/api/v1/models"

USER_AGENT = (
    "Zorix-Metron-Provider-Sync/1.0 "
    "(https://updates.zorix.it/)"
)


LOCAL_PROVIDER_LOGOS = {
    "OpenAI":
        "/number-of-calls/assets/logos/openai.svg",

    "Anthropic":
        "/number-of-calls/assets/logos/anthropic.svg",

    "Google":
        "/number-of-calls/assets/logos/google.svg",

    "Google AI Studio":
        "/number-of-calls/assets/logos/google.svg",

    "Google Vertex":
        "/number-of-calls/assets/logos/google.svg",

    "Google Vertex (US)":
        "/number-of-calls/assets/logos/google.svg",

    "Google Vertex (Europe)":
        "/number-of-calls/assets/logos/google.svg",

    "DeepSeek":
        "/number-of-calls/assets/logos/deepseek.svg",

    "Tencent":
        "/number-of-calls/assets/logos/hunyuan.svg",

    "Tencent Cloud":
        "/number-of-calls/assets/logos/hunyuan.svg",

    "Xiaomi":
        "/number-of-calls/assets/logos/mimo.svg",

    "Z.ai":
        "/number-of-calls/assets/logos/glm.svg",

    "Moonshot AI":
        "/number-of-calls/assets/logos/kimi.svg",

    "NVIDIA":
        "/number-of-calls/assets/logos/nvidia.svg",

    "Meta":
        "/number-of-calls/assets/logos/meta.svg",

    "Zorix":
        "/number-of-calls/assets/logos/zorix.svg"
}


# Known company domains used only for favicon display.
# Unknown providers deliberately fall back to initials instead
# of assigning an incorrect logo.
PROVIDER_DOMAINS = {
    "Azure": "azure.microsoft.com",
    "Azure (US)": "azure.microsoft.com",
    "Azure (EU)": "azure.microsoft.com",

    "Amazon Bedrock": "aws.amazon.com",
    "Amazon Bedrock (US)": "aws.amazon.com",
    "Amazon Bedrock (EU)": "aws.amazon.com",
    "Claude Platform on AWS": "aws.amazon.com",

    "DigitalOcean": "digitalocean.com",
    "DeepInfra": "deepinfra.com",
    "NovitaAI": "novita.ai",
    "CoreWeave": "coreweave.com",
    "GMICloud": "gmicloud.ai",
    "Baidu Qianfan": "cloud.baidu.com",
    "Alibaba Cloud Int.": "alibabacloud.com",
    "Alibaba Cloud Intl.": "alibabacloud.com",
    "Baseten": "baseten.co",
    "Together": "together.ai",
    "Venice": "venice.ai",
    "Phala": "phala.network",
    "AtlasCloud": "atlascloud.ai",
    "SiliconFlow": "siliconflow.com",
    "Reka AI": "reka.ai",
    "Parasail": "parasail.io"
}


def now():
    return (
        datetime.now()
        .astimezone()
        .isoformat(timespec="seconds")
    )


def load_json(path, default):
    try:
        return json.loads(
            path.read_text(encoding="utf-8")
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
        ) + "\n",
        encoding="utf-8"
    )


def load_model_index():
    if not MODEL_INDEX.exists():
        return []

    text = MODEL_INDEX.read_text(
        encoding="utf-8"
    )

    prefix = "window.ZORIX_MODEL_INDEX = "

    if not text.startswith(prefix):
        return []

    raw = text[len(prefix):].strip()

    if raw.endswith(";"):
        raw = raw[:-1]

    try:
        data = json.loads(raw)
        return data if isinstance(data, list) else []
    except Exception:
        return []


def fetch_json(url):
    req = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json"
        }
    )

    with urlopen(
        req,
        timeout=25
    ) as response:
        return json.loads(
            response.read().decode("utf-8")
        )


def per_million(value):
    if value in (
        None,
        "",
        "null"
    ):
        return None

    try:
        return float(value) * 1_000_000
    except Exception:
        return None


def round_price(value):
    if value is None:
        return None

    if value == 0:
        return 0

    if value < 0.001:
        return round(value, 6)

    if value < 0.01:
        return round(value, 5)

    if value < 1:
        return round(value, 4)

    return round(value, 3)


def p50(value):
    if not isinstance(value, dict):
        return None

    try:
        return float(
            value.get("p50")
        )
    except Exception:
        return None


def uptime(endpoint):
    for key in (
        "uptime_last_1d",
        "uptime_last_30m",
        "uptime_last_5m"
    ):
        value = endpoint.get(key)

        if value is None:
            continue

        try:
            value = float(value)

            if 0 <= value <= 1:
                value *= 100

            return round(value, 2)

        except Exception:
            continue

    return None


def provider_slug(endpoint):
    raw = (
        endpoint.get("tag")
        or endpoint.get("provider_slug")
        or ""
    )

    raw = str(raw).strip()

    if raw:
        return raw.split("/")[0]

    name = str(
        endpoint.get(
            "provider_name",
            ""
        )
    )

    return (
        re.sub(
            r"[^a-z0-9]+",
            "-",
            name.lower()
        )
        .strip("-")
    )


def provider_logo(name):
    if name in LOCAL_PROVIDER_LOGOS:
        return {
            "type": "local",
            "url": LOCAL_PROVIDER_LOGOS[name]
        }

    domain = PROVIDER_DOMAINS.get(name)

    if domain:
        return {
            "type": "favicon",
            "url": (
                "https://icons.duckduckgo.com/"
                f"ip3/{domain}.ico"
            )
        }

    return {
        "type": "initial",
        "url": ""
    }


def endpoint_row(endpoint):
    name = str(
        endpoint.get(
            "provider_name",
            "Provider"
        )
    )

    pricing = endpoint.get(
        "pricing",
        {}
    ) or {}

    tag = provider_slug(endpoint)

    latency = p50(
        endpoint.get(
            "latency_last_30m"
        )
    )

    throughput = p50(
        endpoint.get(
            "throughput_last_30m"
        )
    )

    return {
        "name": name,
        "slug": tag,

        "logo": provider_logo(name),

        "input": round_price(
            per_million(
                pricing.get("prompt")
            )
        ),

        "output": round_price(
            per_million(
                pricing.get("completion")
            )
        ),

        "cacheRead": round_price(
            per_million(
                pricing.get(
                    "input_cache_read"
                )
            )
        ),

        "cacheWrite": round_price(
            per_million(
                pricing.get(
                    "input_cache_write"
                )
            )
        ),

        "latencyP50": (
            round(latency, 2)
            if latency is not None
            else None
        ),

        "throughputP50": (
            round(throughput, 1)
            if throughput is not None
            else None
        ),

        "uptime": uptime(endpoint),

        "quantization":
            endpoint.get(
                "quantization"
            ),

        "contextLength":
            endpoint.get(
                "context_length"
            ),

        "status":
            endpoint.get(
                "status"
            ),

        "link": (
            "https://openrouter.ai/provider/"
            +
            quote(tag, safe="")
            if tag
            else ""
        ),

        "sourceKind":
            "OpenRouter endpoint",

        "telemetrySource":
            "OpenRouter"
    }


def numeric_from_string(value):
    if value in (
        None,
        "",
        "—"
    ):
        return None

    text = str(value).strip()

    if "–" in text or "-" in text[1:]:
        return None

    match = re.search(
        r"[-+]?[0-9]*\.?[0-9]+",
        text
    )

    if not match:
        return None

    try:
        return float(match.group(0))
    except Exception:
        return None


def official_fallback(
    model,
    pricing_db
):
    model_id = model.get("id")

    routes = (
        pricing_db
        .get("models", {})
        .get(model_id, [])
    )

    if not routes:
        return []

    route = routes[0]

    provider = (
        route.get("provider")
        or model.get("provider")
        or "Provider"
    )

    return [
        {
            "name": provider,

            "slug": "",

            "logo": {
                "type": "local",
                "url": (
                    route.get("logo")
                    or model.get("logo")
                    or ""
                )
            },

            "input":
                numeric_from_string(
                    route.get("input")
                ),

            "output":
                numeric_from_string(
                    route.get("output")
                ),

            "cacheRead":
                numeric_from_string(
                    route.get("cache")
                ),

            "cacheWrite": None,

            "latencyP50": None,
            "throughputP50": None,
            "uptime": None,

            "quantization": None,
            "contextLength": None,
            "status": None,

            "link":
                route.get("url")
                or route.get("source")
                or "",

            "sourceKind":
                route.get(
                    "sourceKind",
                    "Official"
                ),

            "telemetrySource": None,

            "rawInput":
                route.get("input"),

            "rawOutput":
                route.get("output"),

            "rawCache":
                route.get("cache")
        }
    ]


def zorix_provider():
    return [
        {
            "name": "Zorix",
            "slug": "zorix",

            "logo": {
                "type": "local",
                "url":
                    "/number-of-calls/assets/logos/zorix.svg"
            },

            "input": None,
            "output": None,
            "cacheRead": None,
            "cacheWrite": None,

            "latencyP50": None,
            "throughputP50": None,
            "uptime": None,

            "quantization": None,
            "contextLength": None,
            "status": None,

            "link":
                "https://subs.zorix.it/",

            "sourceKind":
                "Zorix",

            "telemetrySource":
                None,

            "billing":
                "Paid subscription"
        }
    ]


def snapshot_for(providers):
    result = {}

    for row in providers:
        key = (
            row.get("slug")
            or row.get("name")
        )

        if not key:
            continue

        result[key] = {
            "name":
                row.get("name"),

            "input":
                row.get("input"),

            "output":
                row.get("output"),

            "cacheRead":
                row.get("cacheRead")
        }

    return result


mapping = load_json(
    MAP_FILE,
    {}
)

pricing_db = load_json(
    PRICING_FILE,
    {}
)

models = load_model_index()

previous = load_json(
    DATA_OUT,
    {
        "updatedAt": None,
        "models": {}
    }
)

previous_models = (
    previous.get("models", {})
    if isinstance(
        previous.get("models"),
        dict
    )
    else {}
)

result_models = {}
errors = []
success = []


for model in models:

    model_id = model.get("id")

    if not model_id:
        continue

    old = previous_models.get(
        model_id,
        {}
    )

    history = (
        old.get("history", [])
        if isinstance(
            old.get("history"),
            list
        )
        else []
    )

    # --------------------------------------------------------
    # Zorix-owned models: only Zorix provider.
    # --------------------------------------------------------

    if model.get("provider") == "Zorix":

        providers = zorix_provider()

        result_models[model_id] = {
            "modelId": model_id,
            "modelName":
                model.get("name"),

            "source":
                "Zorix",

            "sourceUrl":
                "https://subs.zorix.it/",

            "openrouterModel":
                None,

            "providers":
                providers,

            "history":
                history
        }

        continue


    openrouter_id = mapping.get(
        model_id
    )


    # --------------------------------------------------------
    # Exact OpenRouter model match.
    # --------------------------------------------------------

    if openrouter_id:

        try:

            author, slug = (
                openrouter_id.split(
                    "/",
                    1
                )
            )

            url = (
                API_ROOT
                +
                "/"
                +
                quote(author, safe="")
                +
                "/"
                +
                quote(slug, safe="")
                +
                "/endpoints"
            )

            payload = fetch_json(url)

            data = payload.get(
                "data",
                {}
            )

            endpoints = data.get(
                "endpoints",
                []
            )

            if not isinstance(
                endpoints,
                list
            ):
                endpoints = []

            providers = [
                endpoint_row(endpoint)
                for endpoint in endpoints
                if isinstance(
                    endpoint,
                    dict
                )
            ]

            providers = [
                row
                for row in providers
                if row.get("name")
            ]

            providers.sort(
                key=lambda row: (
                    row.get("input")
                    is None,

                    row.get("input")
                    if row.get("input")
                    is not None
                    else float("inf"),

                    row.get("name", "")
                )
            )

            if not providers:
                raise RuntimeError(
                    "No provider endpoints returned."
                )

            success.append(model_id)

            result_models[model_id] = {
                "modelId":
                    model_id,

                "modelName":
                    model.get("name"),

                "source":
                    "OpenRouter Endpoints API",

                "sourceUrl":
                    (
                        "https://openrouter.ai/"
                        +
                        openrouter_id
                    ),

                "openrouterModel":
                    openrouter_id,

                "providers":
                    providers,

                "history":
                    history
            }

        except Exception as exc:

            errors.append(
                {
                    "modelId":
                        model_id,

                    "openrouterModel":
                        openrouter_id,

                    "error":
                        str(exc)
                }
            )

            cached = old.get(
                "providers",
                []
            )

            if cached:

                result_models[model_id] = {
                    **old,
                    "syncWarning":
                        str(exc)
                }

            else:

                result_models[model_id] = {
                    "modelId":
                        model_id,

                    "modelName":
                        model.get("name"),

                    "source":
                        "Official fallback",

                    "sourceUrl":
                        "",

                    "openrouterModel":
                        openrouter_id,

                    "providers":
                        official_fallback(
                            model,
                            pricing_db
                        ),

                    "history":
                        history,

                    "syncWarning":
                        str(exc)
                }

        continue


    # --------------------------------------------------------
    # No exact OpenRouter match:
    # official data only.
    # --------------------------------------------------------

    providers = official_fallback(
        model,
        pricing_db
    )

    result_models[model_id] = {
        "modelId":
            model_id,

        "modelName":
            model.get("name"),

        "source":
            "Official provider data"
            if providers
            else "Not published",

        "sourceUrl":
            (
                providers[0].get(
                    "link",
                    ""
                )
                if providers
                else ""
            ),

        "openrouterModel":
            None,

        "providers":
            providers,

        "history":
            history
    }


# ============================================================
# REAL PRICE HISTORY
#
# Only append actual sync snapshots.
# No generated dates or estimated curves.
# ============================================================

sync_time = now()

for model_id, item in (
    result_models.items()
):

    providers = item.get(
        "providers",
        []
    )

    if not providers:
        continue

    # Zorix subscription row does not have per-token history.
    if (
        item.get("source")
        ==
        "Zorix"
    ):
        continue

    current = snapshot_for(
        providers
    )

    if not current:
        continue

    history = item.setdefault(
        "history",
        []
    )

    append = True

    if history:
        last = history[-1]

        # Avoid multiple snapshots within 6 hours
        # when the price table has not changed.
        if (
            last.get("providers")
            ==
            current
        ):
            try:
                previous_time = (
                    datetime.fromisoformat(
                        last["at"]
                    )
                )

                current_time = (
                    datetime.fromisoformat(
                        sync_time
                    )
                )

                if (
                    current_time
                    -
                    previous_time
                    <
                    timedelta(hours=6)
                ):
                    append = False

            except Exception:
                pass

    if append:

        history.append(
            {
                "at":
                    sync_time,

                "providers":
                    current
            }
        )

    item["history"] = (
        history[-120:]
    )


output = {
    "updatedAt":
        sync_time,

    "currency":
        "USD",

    "unit":
        "per 1M tokens",

    "models":
        result_models
}


write_json(
    DATA_OUT,
    output
)


JS_OUT.parent.mkdir(
    parents=True,
    exist_ok=True
)

JS_OUT.write_text(
    "window.ZORIX_MODEL_PROVIDERS = "
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
    "at":
        sync_time,

    "mapped":
        len(mapping),

    "synced":
        len(success),

    "errors":
        errors,

    "ok":
        len(errors) == 0
}


write_json(
    REPORT,
    report
)


print()
print("MODEL PROVIDER SYNC")
print("-------------------")
print("Exact mapped:", len(mapping))
print("Synced:", len(success))
print("Errors:", len(errors))
print()

for item in errors:
    print(
        "WARNING:",
        item["modelId"],
        "=>",
        item["error"]
    )

print()
print(
    "Built:",
    DATA_OUT
)

print(
    "Built:",
    JS_OUT
)
