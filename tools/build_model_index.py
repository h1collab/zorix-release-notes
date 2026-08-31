#!/usr/bin/env python3

from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parents[1]

SOURCE = ROOT / "data/models.json"

OUTPUT = (
    ROOT /
    "number-of-calls/model-index.js"
)


# ------------------------------------------------------------
# Stable IDs already used by Metron.
# Never silently change these IDs because URLs depend on them.
# ------------------------------------------------------------

KNOWN_IDS = {

    "Nex Coder 3.8 Preview — Neptune":
        "nex-coder-38-neptune",

    "Nex Coder 3.8 Preview Neptune":
        "nex-coder-38-neptune",

    "Zorix Nex Coder 3.7 Pro (Max)":
        "nex-coder-37-pro-max",

    "DeepSeek V4 Flash 0731":
        "deepseek-v4-flash-0731",

    "Tencent Hy3":
        "tencent-hy3",

    "Xiaomi MiMo-V2.5":
        "mimo-v25",

    "GPT-5.6 Luna":
        "gpt-56-luna",

    "Claude Opus 5":
        "claude-opus-5",

    "GLM 5.3 Flash":
        "glm-53-flash",

    "GLM 5.2 Max":
        "glm-52-max",

    "Gemini 3.7 Flash":
        "gemini-37-flash",

    "Claude Sonnet 5":
        "claude-sonnet-5",

    "Claude Opus 4.8":
        "claude-opus-48",

    "Claude Fable 5 (with fallback max)":
        "claude-fable-5-fallback-max",

    "GPT-5.6 Sol (Max)":
        "gpt-56-sol-max",

    "Kimi K2.7 Code":
        "kimi-k27-code",

    "Kimi K3":
        "kimi-k3",

    "Gemini 3.6 Flash":
        "gemini-36-flash",

    "Muse Spark 1.2":
        "muse-spark-12",

    "GLM 5.1":
        "glm-51",

    "NVIDIA Nemotron 3 Ultra":
        "nemotron-3-ultra"
}


LOGOS = {

    "Zorix":
        "/number-of-calls/assets/logos/zorix.svg",

    "DeepSeek":
        "/number-of-calls/assets/logos/deepseek.svg",

    "Tencent":
        "/number-of-calls/assets/logos/hunyuan.svg",

    "Xiaomi":
        "/number-of-calls/assets/logos/mimo.svg",

    "OpenAI":
        "/number-of-calls/assets/logos/openai.svg",

    "Anthropic":
        "/number-of-calls/assets/logos/anthropic.svg",

    "Z.ai":
        "/number-of-calls/assets/logos/glm.svg",

    "Google":
        "/number-of-calls/assets/logos/google.svg",

    "Moonshot AI":
        "/number-of-calls/assets/logos/kimi.svg",

    "Meta":
        "/number-of-calls/assets/logos/meta.svg",

    "NVIDIA":
        "/number-of-calls/assets/logos/nvidia.svg"
}


COLORS = {

    "Zorix":
        "#2563EB",

    "DeepSeek":
        "#4D6BFE",

    "Tencent":
        "#00A7CE",

    "Xiaomi":
        "#FF6900",

    "OpenAI":
        "#111111",

    "Anthropic":
        "#D97757",

    "Z.ai":
        "#8B5CF6",

    "Google":
        "#4285F4",

    "Moonshot AI":
        "#1783FF",

    "Meta":
        "#087AEA",

    "NVIDIA":
        "#74B71B"
}


def slugify(name):

    value = (
        name.lower()
        .replace("—", "-")
    )

    value = re.sub(
        r"[^a-z0-9]+",
        "-",
        value
    )

    return value.strip("-")


models = json.loads(
    SOURCE.read_text(
        encoding="utf-8"
    )
)


result = []


for row in models:

    name = str(
        row.get(
            "name",
            ""
        )
    ).strip()


    if not name:
        continue


    provider = str(
        row.get(
            "provider",
            ""
        )
    ).strip()


    model_id = (
        row.get("id")
        or
        KNOWN_IDS.get(name)
        or
        slugify(name)
    )


    daily = int(
        row.get(
            "tokens",
            0
        )
        or 0
    )


    weekly_raw = row.get(
        "weeklyTokens"
    )


    weekly = (
        int(weekly_raw)
        if weekly_raw is not None
        else daily * 7
    )


    result.append(
        {
            "id":
                model_id,

            "name":
                name,

            "provider":
                provider,

            "family":
                row.get(
                    "family",
                    ""
                ),

            "status":
                row.get(
                    "status",
                    "Available"
                ),

            "logo":
                LOGOS.get(
                    provider,
                    ""
                ),

            "color":
                COLORS.get(
                    provider,
                    "#111111"
                ),

            "dailyTokens":
                daily,

            "weeklyTokens":
                weekly,

            "weeklyEstimated":
                weekly_raw is None,

            "context":
                row.get(
                    "context",
                    "—"
                ),

            "parameters":
                row.get(
                    "parameters",
                    "Undisclosed"
                ),

            "activeParameters":
                row.get(
                    "activeParameters",
                    "Undisclosed"
                ),

            "architecture":
                row.get(
                    "architecture",
                    "Undisclosed"
                ),

            "inputPrice":
                row.get(
                    "inputPrice",
                    "—"
                ),

            "outputPrice":
                row.get(
                    "outputPrice",
                    "—"
                ),

            "about":
                row.get(
                    "about",
                    (
                        f"{name} is currently listed in "
                        "Zorix Metron. Usage figures on this "
                        "page represent traffic recorded "
                        "inside Zorix Code / Metron."
                    )
                ),

            "docs":
                row.get(
                    "docs",
                    ""
                ),

            # No fabricated historical chart.
            "chart":
                row.get(
                    "chart",
                    []
                )
        }
    )


OUTPUT.write_text(
    "window.ZORIX_MODEL_INDEX = "
    +
    json.dumps(
        result,
        ensure_ascii=False,
        indent=2
    )
    +
    ";\n",
    encoding="utf-8"
)


print(
    "Built model-index.js:",
    len(result),
    "models"
)

for model in result:
    print(
        model["id"],
        "|",
        model["name"]
    )
