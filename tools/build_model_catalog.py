#!/usr/bin/env python3

from pathlib import Path
from collections import defaultdict
import html
import json
import re


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/models.json"
OUT = ROOT / "models"


def slugify(value):
    value = str(value or "").strip().lower()
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "unknown"


def provider_slug(provider):
    mapping = {
        "Zorix": "zorix",
        "Anthropic": "anthropic",
        "OpenAI": "openai",
        "Google": "google",
        "DeepSeek": "deepseek",
        "Tencent": "tencent",
        "Xiaomi": "xiaomi",
        "Z.ai": "z-ai",
        "Moonshot AI": "moonshot-ai",
        "Meta": "meta",
        "NVIDIA": "nvidia",
        "Undisclosed": "undisclosed",
    }
    return mapping.get(provider, slugify(provider))


def family_key(row):
    provider = str(row.get("provider") or "")
    family = str(row.get("family") or "")
    name = str(row.get("name") or "")

    if provider == "Zorix" and (
        family.startswith("Nex Coder")
        or
        name.startswith("Nex Coder")
        or
        "Nex Coder" in name
    ):
        return "nexcoder", "Nex Coder"

    if provider == "Anthropic":
        return "claude", "Claude"

    if provider == "OpenAI" and (
        family.startswith("GPT-5.6")
        or
        name.startswith("GPT-5.6")
    ):
        return "gpt-5-6", "GPT-5.6"

    if provider == "Google" and (
        family.startswith("Gemini")
        or
        name.startswith("Gemini")
    ):
        return "gemini", "Gemini"

    if provider == "DeepSeek":
        return "deepseek-v4", "DeepSeek V4"

    if provider == "Tencent" and (
        family.startswith("Hy")
        or
        "Hy" in name
    ):
        return "hy", "Tencent Hy"

    if provider == "Xiaomi":
        return "mimo", "MiMo"

    if provider == "Z.ai":
        return "glm", "GLM"

    if provider == "Moonshot AI":
        return "kimi", "Kimi"

    if provider == "Meta":
        return "muse-spark", "Muse Spark"

    if provider == "NVIDIA":
        return "nemotron", "Nemotron"

    if provider == "Undisclosed":
        return "wolf-theta", "Wolf Theta"

    label = family or name or "Models"
    return slugify(label), label


def esc(value):
    return html.escape(str(value or ""), quote=True)


def compact(value):
    try:
        n = float(value)
    except Exception:
        return "—"

    if n >= 1_000_000_000_000:
        return f"{n / 1_000_000_000_000:.2f}".rstrip("0").rstrip(".") + "T"
    if n >= 1_000_000_000:
        return f"{n / 1_000_000_000:.2f}".rstrip("0").rstrip(".") + "B"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.2f}".rstrip("0").rstrip(".") + "M"
    if n >= 1_000:
        return f"{n / 1_000:.2f}".rstrip("0").rstrip(".") + "K"

    return f"{int(n):,}"


def observation(row):
    parts = []

    if row.get("fiveHourTokens") is not None:
        parts.append(
            f"{compact(row.get('fiveHourTokens'))} tokens / 5h"
        )

    if row.get("weeklyTokens") is not None:
        parts.append(
            f"{compact(row.get('weeklyTokens'))} tokens / week"
        )

    if row.get("thirtyDayTokens") is not None:
        parts.append(
            f"{compact(row.get('thirtyDayTokens'))} tokens / 30d"
        )

    if row.get("weeklyRequests") is not None:
        parts.append(
            f"{compact(row.get('weeklyRequests'))} requests / week"
        )

    if (
        row.get("tokens") is not None
        and
        float(row.get("tokens") or 0) > 0
    ):
        parts.append(
            f"{compact(row.get('tokens'))} recorded tokens"
        )

    return " · ".join(parts) if parts else "No published usage total"


BASE_STYLE = r"""
:root{
  --paper:#f4f2eb;
  --ink:#151513;
  --muted:#69665f;
  --line:#c9c5ba;
  --soft:#ece9df;
  --max:1180px;
}
*{box-sizing:border-box}
html{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body{
  margin:0;
  background:var(--paper);
  color:var(--ink);
  font-family:
    "OpenAI Sans",
    "Inter",
    ui-sans-serif,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Helvetica,
    Arial,
    sans-serif;
  letter-spacing:-.012em;
}
a{color:inherit;text-decoration:none}
.site-head{
  min-height:72px;
  border-bottom:1px solid var(--line);
}
.nav{
  width:min(var(--max),100%);
  min-height:72px;
  margin:auto;
  padding:0 24px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
}
.brand{font-size:25px;font-weight:650;letter-spacing:-.055em}
.nav-links{display:flex;gap:22px;color:var(--muted);font-size:11px}
main{
  width:min(var(--max),100%);
  margin:auto;
  padding:65px 24px 105px;
}
.eyebrow{
  color:var(--muted);
  font-size:11px;
  letter-spacing:.06em;
  text-transform:uppercase;
}
.hero{
  padding-bottom:68px;
  border-bottom:1px solid var(--ink);
}
h1{
  max-width:980px;
  margin:22px 0 0;
  font-family:Georgia,"Times New Roman",serif;
  font-size:clamp(58px,9vw,126px);
  line-height:.88;
  font-weight:400;
  letter-spacing:-.07em;
}
.support-line{
  max-width:760px;
  margin-top:38px;
  font-family:Georgia,"Times New Roman",serif;
  font-size:clamp(25px,3.6vw,42px);
  line-height:1.18;
  letter-spacing:-.035em;
}
.hero-copy{
  max-width:720px;
  margin-top:24px;
  color:var(--muted);
  font-size:12px;
  line-height:1.65;
}
.actions{
  margin-top:27px;
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.action{
  min-height:43px;
  padding:0 14px;
  display:inline-flex;
  align-items:center;
  border:1px solid var(--ink);
  border-radius:7px;
  font-size:11px;
}
.action.primary{background:var(--ink);color:var(--paper)}
.action.external::after{content:"↗";margin-left:12px;font-size:9px}
.action.internal::after{content:"→";margin-left:12px;font-size:9px}
.directory{
  padding-top:56px;
}
.directory-title{
  margin:0 0 27px;
  font-size:clamp(30px,4vw,45px);
  letter-spacing:-.05em;
}
.family-grid,
.provider-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  border-top:1px solid var(--ink);
  border-left:1px solid var(--ink);
}
.family-card,
.provider-card{
  min-height:190px;
  padding:22px;
  border-right:1px solid var(--ink);
  border-bottom:1px solid var(--ink);
}
.family-card h2,
.provider-card h2{
  margin:55px 0 0;
  font-family:Georgia,"Times New Roman",serif;
  font-size:clamp(28px,3.6vw,47px);
  line-height:1;
  font-weight:400;
  letter-spacing:-.045em;
}
.family-meta,
.provider-meta{
  margin-top:15px;
  color:var(--muted);
  font-size:10px;
}
.model-list{
  margin-top:50px;
  border-top:1px solid var(--ink);
}
.model-row{
  display:grid;
  grid-template-columns:minmax(0,1.4fr) minmax(150px,.6fr) minmax(180px,.8fr);
  gap:18px;
  padding:21px 0;
  border-bottom:1px solid var(--line);
  align-items:start;
}
.model-name{
  font-family:Georgia,"Times New Roman",serif;
  font-size:20px;
  line-height:1.2;
}
.model-status{
  color:var(--muted);
  font-size:10px;
}
.model-observation{
  color:var(--muted);
  font-size:10px;
  line-height:1.5;
}
.note{
  max-width:760px;
  margin-top:45px;
  padding-top:20px;
  border-top:1px solid var(--line);
  color:var(--muted);
  font-size:10px;
  line-height:1.6;
}
.breadcrumb{
  margin-bottom:35px;
  color:var(--muted);
  font-size:10px;
}
.breadcrumb a{border-bottom:1px solid transparent}
.breadcrumb a:hover{border-bottom-color:currentColor}
footer{
  border-top:1px solid var(--line);
}
.footer-inner{
  width:min(var(--max),100%);
  margin:auto;
  padding:40px 24px 55px;
  display:flex;
  justify-content:space-between;
  gap:30px;
  color:var(--muted);
  font-size:9px;
}
@media(max-width:720px){
  .nav{padding:0 18px}
  .nav-links{display:none}
  main{padding:45px 18px 78px}
  .family-grid,.provider-grid{grid-template-columns:1fr}
  .model-row{grid-template-columns:1fr;gap:7px}
  .footer-inner{padding:35px 18px 48px;flex-direction:column}
}
"""


def shell(title, body, description="Zorix model directory"):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="{esc(description)}">
<title>{esc(title)} | Zorix Models</title>
<style>{BASE_STYLE}</style>
</head>
<body>
<header class="site-head">
  <nav class="nav">
    <a class="brand" href="/">Zorix</a>
    <div class="nav-links">
      <a href="/models/">Models</a>
      <a href="/number-of-calls/">Metron</a>
      <a href="/status/">Status</a>
    </div>
  </nav>
</header>
{body}
<footer>
  <div class="footer-inner">
    <span>Zorix Models</span>
    <span>Metron support and usage observations remain separate from provider ownership.</span>
  </div>
</footer>
</body>
</html>
"""


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def model_card(row):
    return f"""
<div class="model-row">
  <div>
    <div class="model-name">{esc(row.get("name"))}</div>
  </div>
  <div class="model-status">
    {esc(row.get("status") or "Available")}
  </div>
  <div class="model-observation">
    {esc(observation(row))}
  </div>
</div>
"""


def family_page(provider, pslug, fslug, label, rows):
    zorix_owned = provider == "Zorix"

    if zorix_owned:
        eyebrow = "Introducing"
        support = (
            f"{label} is a Zorix model family. "
            "This directory keeps the family overview, Metron observations, "
            "and feature pages in one place."
        )
    else:
        eyebrow = "Zorix Metron"
        support = "Added to Zorix Metron support"

    actions = [
        '<a class="action primary internal" href="/number-of-calls/">Open Metron</a>'
    ]

    if provider == "Zorix" and fslug == "nexcoder":
        actions.insert(
            0,
            '<a class="action internal" href="/nex-coder-38-neptune/">Neptune feature</a>'
        )

    official_docs = []
    for row in rows:
        docs = str(row.get("docs") or "").strip()
        if docs.startswith("https://") and docs not in official_docs:
            official_docs.append(docs)

    for index, docs in enumerate(official_docs[:2]):
        actions.append(
            f'<a class="action external" href="{esc(docs)}" target="_blank" rel="noopener">Official docs</a>'
        )

    if provider == "Anthropic" and fslug == "claude":
        actions.append(
            '<a class="action external" href="https://www.anthropic.com/claude-fable-and-mythos-5-1" target="_blank" rel="noopener">More details</a>'
        )

    model_rows = "".join(model_card(row) for row in rows)

    related_note = ""
    if provider == "Anthropic" and fslug == "claude":
        related_note = """
<div class="note">
  More details links to Anthropic’s “Claude Fable and Mythos 5.1”
  article. That external article is not evidence that Zorix Metron tracks every
  model named there; this page lists only models present in the current Zorix
  model dataset.
</div>
"""

    body = f"""
<main>
  <div class="breadcrumb">
    <a href="/models/">Models</a>
    &nbsp;/&nbsp;
    <a href="/models/{esc(pslug)}/">{esc(provider)}</a>
    &nbsp;/&nbsp;
    {esc(label)}
  </div>

  <section class="hero">
    <div class="eyebrow">{esc(eyebrow)}</div>
    <h1>{esc(label)}</h1>
    <div class="support-line">{esc(support)}</div>
    <div class="hero-copy">
      {esc(provider)} · {len(rows)} model{"s" if len(rows) != 1 else ""} in this family.
      Provider ownership and Zorix Metron support are shown separately.
    </div>
    <div class="actions">
      {"".join(actions)}
    </div>
  </section>

  <section class="directory">
    <h2 class="directory-title">Models</h2>
    <div class="model-list">
      {model_rows}
    </div>
    {related_note}
  </section>
</main>
"""

    return shell(
        f"{label} · {provider}",
        body,
        description=f"{label} models listed in the Zorix model directory.",
    )


def provider_page(provider, pslug, families):
    cards = []

    for fslug, info in sorted(
        families.items(),
        key=lambda item: item[1]["label"].lower()
    ):
        cards.append(
            f"""
<a
  class="family-card"
  href="/models/{esc(pslug)}/{esc(fslug)}/"
>
  <div class="eyebrow">Model family</div>
  <h2>{esc(info["label"])}</h2>
  <div class="family-meta">
    {len(info["rows"])} model{"s" if len(info["rows"]) != 1 else ""}
  </div>
</a>
"""
        )

    body = f"""
<main>
  <div class="breadcrumb">
    <a href="/models/">Models</a>
    &nbsp;/&nbsp;
    {esc(provider)}
  </div>

  <section class="hero">
    <div class="eyebrow">Company directory</div>
    <h1>{esc(provider)}</h1>
    <div class="support-line">
      {"Zorix model families" if provider == "Zorix" else "Models listed through Zorix Metron support"}
    </div>
  </section>

  <section class="directory">
    <h2 class="directory-title">Families</h2>
    <div class="family-grid">
      {"".join(cards)}
    </div>
  </section>
</main>
"""

    return shell(
        provider,
        body,
        description=f"{provider} model families in the Zorix model directory.",
    )


def root_page(grouped):
    cards = []

    for provider, info in sorted(
        grouped.items(),
        key=lambda item: item[0].lower()
    ):
        model_count = sum(
            len(family["rows"])
            for family in info["families"].values()
        )

        cards.append(
            f"""
<a
  class="provider-card"
  href="/models/{esc(info["slug"])}/"
>
  <div class="eyebrow">Company</div>
  <h2>{esc(provider)}</h2>
  <div class="provider-meta">
    {len(info["families"])} famil{"y" if len(info["families"]) == 1 else "ies"}
    · {model_count} model{"s" if model_count != 1 else ""}
  </div>
</a>
"""
        )

    body = f"""
<main>
  <section class="hero">
    <div class="eyebrow">Zorix Models</div>
    <h1>Model directory</h1>
    <div class="support-line">
      Browse by company, then model family.
    </div>
    <div class="hero-copy">
      Zorix-owned model families may use product-introduction language.
      Third-party model pages use “Added to Zorix Metron support” so
      provider ownership remains clear.
    </div>
    <div class="actions">
      <a class="action primary internal" href="/number-of-calls/">Open Metron</a>
    </div>
  </section>

  <section class="directory">
    <h2 class="directory-title">Companies</h2>
    <div class="provider-grid">
      {"".join(cards)}
    </div>
  </section>
</main>
"""

    return shell(
        "Model directory",
        body,
        description="Browse Zorix model listings by company and model family.",
    )


def main():
    rows = json.loads(
        SOURCE.read_text(
            encoding="utf-8"
        )
    )

    grouped = {}

    for row in rows:
        provider = str(row.get("provider") or "Unknown")
        pslug = provider_slug(provider)
        fslug, label = family_key(row)

        provider_info = grouped.setdefault(
            provider,
            {
                "slug": pslug,
                "families": {}
            }
        )

        family_info = provider_info["families"].setdefault(
            fslug,
            {
                "label": label,
                "rows": []
            }
        )

        family_info["rows"].append(row)

    write(
        OUT / "index.html",
        root_page(grouped)
    )

    written = [
        "/models/"
    ]

    for provider, info in grouped.items():
        pslug = info["slug"]

        write(
            OUT / pslug / "index.html",
            provider_page(
                provider,
                pslug,
                info["families"]
            )
        )

        written.append(
            f"/models/{pslug}/"
        )

        for fslug, family in info["families"].items():
            write(
                OUT / pslug / fslug / "index.html",
                family_page(
                    provider,
                    pslug,
                    fslug,
                    family["label"],
                    family["rows"]
                )
            )

            written.append(
                f"/models/{pslug}/{fslug}/"
            )

    print(
        "Built model catalog routes:"
    )

    for route in sorted(written):
        print(
            " ",
            route
        )


if __name__ == "__main__":
    main()

