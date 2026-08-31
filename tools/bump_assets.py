#!/usr/bin/env python3

from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import (
    urlsplit,
    urlunsplit,
    parse_qsl,
    urlencode,
)
import re
import time

ROOT = Path(__file__).resolve().parents[1]

VERSION = str(int(time.time()))

(ROOT / "build-version.txt").write_text(
    VERSION + "\n",
    encoding="utf-8"
)

SKIP = {
    ".git",
    ".github",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
}


def external(url):
    x = url.lower().strip()

    return (
        x.startswith("http://")
        or x.startswith("https://")
        or x.startswith("//")
        or x.startswith("data:")
        or x.startswith("mailto:")
        or x.startswith("tel:")
        or x.startswith("javascript:")
        or x.startswith("#")
    )


def with_param(url, key, value):

    if external(url):
        return url

    parsed = urlsplit(url)

    query = [
        (k, v)
        for k, v in parse_qsl(
            parsed.query,
            keep_blank_values=True
        )
        if k != key
    ]

    query.append(
        (key, value)
    )

    return urlunsplit(
        (
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            urlencode(query),
            parsed.fragment,
        )
    )


ASSET_EXT = re.compile(
    r'\.(?:js|css|svg|png|jpe?g|webp|gif|ico)$',
    re.I
)


def asset_url(url):

    if external(url):
        return url

    path = urlsplit(url).path

    if not ASSET_EXT.search(path):
        return url

    return with_param(
        url,
        "v",
        VERSION
    )


def page_url(url):

    if external(url):
        return url

    parsed = urlsplit(url)
    path = parsed.path

    # Assets/downloads are not page links.
    if "." in Path(path).name and not path.endswith(".html"):
        return url

    if (
        not path
        or path.endswith("/")
        or path.endswith(".html")
        or path in {".", ".."}
    ):
        return with_param(
            url,
            "__v",
            VERSION
        )

    return url


CACHE_META = '''
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
'''


def freshness_block():

    # 注意：
    # script 内不出现任何 .js/.css/.svg asset 字符串，
    # bump_assets 完全不会改 inline script。
    return f'''
<meta name="zorix-build" content="{VERSION}">
<script>
(function(){{
  var expected="{VERSION}";
  var endpoint="/build-version.txt";

  try {{
    fetch(
      endpoint + "?fresh=" + Date.now(),
      {{
        cache:"no-store"
      }}
    )
    .then(function(r){{
      return r.ok ? r.text() : "";
    }})
    .then(function(latest){{
      latest=String(latest || "").trim();

      if(
        latest &&
        latest !== expected
      ){{
        var next=new URL(
          window.location.href
        );

        next.searchParams.set(
          "__v",
          latest
        );

        window.location.replace(
          next.toString()
        );
      }}
    }})
    .catch(function(){{}});
  }} catch(e) {{}}
}})();
</script>
'''


def clean_generated_head(s):

    # Cache meta
    s = re.sub(
        r'\s*<meta\s+http-equiv=["\']Cache-Control["\'][^>]*>',
        "",
        s,
        flags=re.I
    )

    s = re.sub(
        r'\s*<meta\s+http-equiv=["\']Pragma["\'][^>]*>',
        "",
        s,
        flags=re.I
    )

    s = re.sub(
        r'\s*<meta\s+http-equiv=["\']Expires["\'][^>]*>',
        "",
        s,
        flags=re.I
    )

    # Build marker + its immediately following generated script.
    s = re.sub(
        r'''
        \s*
        <meta\s+name=["']zorix-build["'][^>]*>
        \s*
        <script>
        [\s\S]*?
        </script>
        ''',
        "",
        s,
        count=1,
        flags=re.I | re.X
    )

    return s


# ============================================================
# Attribute-level HTML rewriting.
# This never searches arbitrary inline JS text.
# ============================================================

ATTR_RE = re.compile(
    r'''
    (?P<prefix>
      \b(?:src|href)=["']
    )
    (?P<url>[^"']+)
    (?P<quote>["'])
    ''',
    re.I | re.X
)


def process_html(p):

    original = p.read_text(
        encoding="utf-8"
    )

    s = clean_generated_head(
        original
    )

    head = re.search(
        r'<head\b[^>]*>',
        s,
        re.I
    )

    if head:

        inject = (
            "\n"
            + CACHE_META
            + freshness_block()
        )

        s = (
            s[:head.end()]
            + inject
            + s[head.end():]
        )

    def attr_replace(m):

        prefix = m.group("prefix")
        url = m.group("url")
        quote = m.group("quote")

        tag_start = s.rfind(
            "<",
            0,
            m.start()
        )

        tag_end = s.find(
            ">",
            m.start()
        )

        tag = (
            s[tag_start:tag_end+1]
            if tag_start >= 0 and tag_end >= 0
            else ""
        ).lower()

        if (
            "<script" in tag
            or "<img" in tag
            or "<source" in tag
            or "<link" in tag
        ):
            url = asset_url(url)

        elif "<a" in tag:
            url = page_url(url)

        return (
            prefix
            + url
            + quote
        )

    s = ATTR_RE.sub(
        attr_replace,
        s
    )

    if s != original:

        p.write_text(
            s,
            encoding="utf-8"
        )

        return True

    return False


CSS_URL_RE = re.compile(
    r'''
    (url\(\s*["']?)
    ([^)"']+)
    (["']?\s*\))
    ''',
    re.I | re.X
)


def process_css(p):

    original = p.read_text(
        encoding="utf-8"
    )

    s = CSS_URL_RE.sub(
        lambda m:
            m.group(1)
            + asset_url(m.group(2))
            + m.group(3),
        original
    )

    if s != original:

        p.write_text(
            s,
            encoding="utf-8"
        )

        return True

    return False


changed=[]


for p in ROOT.rglob("*"):

    if not p.is_file():
        continue

    if any(
        part in SKIP
        for part in p.parts
    ):
        continue

    try:
        rel=str(
            p.relative_to(ROOT)
        )
    except ValueError:
        continue

    if p.suffix.lower()==".html":

        if process_html(p):
            changed.append(rel)

    elif p.suffix.lower()==".css":

        if process_css(p):
            changed.append(rel)


print()
print("ZORIX SAFE CACHE BUST")
print("---------------------")
print("Build:", VERSION)
print("HTML pages protected")
print("JS/CSS/image src versioned")
print("Inline JavaScript untouched")
print("Files changed:", len(changed))

for item in changed:
    print(" ", item)
