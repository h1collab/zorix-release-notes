#!/usr/bin/env python3

from pathlib import Path
import re
import time
import urllib.parse

ROOT = Path(__file__).resolve().parents[1]

# Whole static site.
roots = [
    ROOT,
]

version = str(int(time.time()))

BUILD_FILE = ROOT / "build-version.txt"

BUILD_FILE.write_text(
    version + "\n",
    encoding="utf-8"
)


# ============================================================
# HELPERS
# ============================================================

def is_external(url):
    u = url.strip().lower()

    return (
        u.startswith("http://")
        or u.startswith("https://")
        or u.startswith("//")
        or u.startswith("data:")
        or u.startswith("mailto:")
        or u.startswith("tel:")
        or u.startswith("javascript:")
    )


def split_fragment(url):
    if "#" in url:
        base, fragment = url.split("#", 1)
        return base, "#" + fragment

    return url, ""


def replace_query_parameter(url, key, value):
    base, fragment = split_fragment(url)

    parsed = urllib.parse.urlsplit(base)

    query = urllib.parse.parse_qsl(
        parsed.query,
        keep_blank_values=True
    )

    query = [
        (k, v)
        for k, v in query
        if k != key
    ]

    query.append(
        (key, value)
    )

    new_query = urllib.parse.urlencode(
        query
    )

    rebuilt = urllib.parse.urlunsplit(
        (
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            new_query,
            parsed.fragment
        )
    )

    return rebuilt + fragment


def add_asset_version(url):
    if (
        not url
        or is_external(url)
        or url.startswith("#")
    ):
        return url

    return replace_query_parameter(
        url,
        "v",
        version
    )


def add_page_version(url):
    if (
        not url
        or is_external(url)
        or url.startswith("#")
    ):
        return url

    base, fragment = split_fragment(url)

    parsed = urllib.parse.urlsplit(base)

    path = parsed.path

    # Do not version downloadable files here.
    if re.search(
        r'\.(?:js|css|svg|png|jpe?g|webp|gif|ico|json|xml|txt|pdf|zip)$',
        path,
        re.I
    ):
        return url

    # Treat directory links and HTML as navigation.
    is_page = (
        path == ""
        or path.endswith("/")
        or path.endswith(".html")
        or path in {".", ".."}
    )

    if not is_page:
        return url

    return replace_query_parameter(
        url,
        "__v",
        version
    )


# ============================================================
# PATTERNS
# ============================================================

SCRIPT_PATTERN = re.compile(
    r'(<script\b[^>]*\bsrc=["\'])'
    r'([^"\']+)'
    r'(["\'])',
    re.I
)

IMG_PATTERN = re.compile(
    r'(<(?:img|source)\b[^>]*\bsrc=["\'])'
    r'([^"\']+)'
    r'(["\'])',
    re.I
)

SRCSET_PATTERN = re.compile(
    r'(<(?:img|source)\b[^>]*\bsrcset=["\'])'
    r'([^"\']+)'
    r'(["\'])',
    re.I
)

LINK_PATTERN = re.compile(
    r'(<link\b[^>]*\bhref=["\'])'
    r'([^"\']+)'
    r'(["\'])',
    re.I
)

ANCHOR_PATTERN = re.compile(
    r'(<a\b[^>]*\bhref=["\'])'
    r'([^"\']+)'
    r'(["\'])',
    re.I
)

CSS_URL_PATTERN = re.compile(
    r'(url\(\s*["\']?)'
    r'([^)\'"]+)'
    r'(["\']?\s*\))',
    re.I
)

JS_ASSET_STRING_PATTERN = re.compile(
    r'(["\'])'
    r'((?:/|\./|\.\./)[^"\']+\.(?:js|css|svg|png|jpe?g|webp|gif|ico))'
    r'(?:\?[^"\']*)?'
    r'(["\'])',
    re.I
)


# ============================================================
# HTML META + FRESHNESS CHECK
# ============================================================

NO_CACHE_META = '''
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
'''

FRESHNESS_TEMPLATE = '''
<meta name="zorix-build" content="{version}">
<script>
(function(){{
  var expected="{version}";

  try{{
    fetch(
      "/build-version.txt?_=" + Date.now(),
      {{
        cache:"no-store",
        headers:{{
          "Cache-Control":"no-cache"
        }}
      }}
    )
    .then(function(response){{
      if(!response.ok){{
        return null;
      }}
      return response.text();
    }})
    .then(function(latest){{
      if(!latest){{
        return;
      }}

      latest=latest.trim();

      if(
        latest &&
        latest!==expected
      ){{
        var url=
          new URL(
            window.location.href
          );

        url.searchParams.set(
          "__v",
          latest
        );

        window.location.replace(
          url.toString()
        );
      }}
    }})
    .catch(function(){{}});
  }}catch(e){{}}
}})();
</script>
'''


def normalize_head(html):
    # Remove previously generated copies.
    html = re.sub(
        r'\s*<meta\s+http-equiv=["\']Cache-Control["\'][^>]*>',
        '',
        html,
        flags=re.I
    )

    html = re.sub(
        r'\s*<meta\s+http-equiv=["\']Pragma["\'][^>]*>',
        '',
        html,
        flags=re.I
    )

    html = re.sub(
        r'\s*<meta\s+http-equiv=["\']Expires["\'][^>]*>',
        '',
        html,
        flags=re.I
    )

    html = re.sub(
        r'\s*<meta\s+name=["\']zorix-build["\'][^>]*>',
        '',
        html,
        flags=re.I
    )

    # Remove old generated freshness script.
    html = re.sub(
        r'\s*<script>\s*\(function\(\)\{\s*var expected=.*?'
        r'/build-version\.txt\?_=.*?</script>',
        '',
        html,
        flags=re.I | re.S
    )

    head_match = re.search(
        r'<head\b[^>]*>',
        html,
        flags=re.I
    )

    if not head_match:
        return html

    injection = (
        "\n"
        + NO_CACHE_META
        + FRESHNESS_TEMPLATE.format(
            version=version
        )
    )

    return (
        html[:head_match.end()]
        + injection
        + html[head_match.end():]
    )


# ============================================================
# HTML VERSIONING
# ============================================================

def version_srcset(value):
    pieces = []

    for raw in value.split(","):
        raw = raw.strip()

        if not raw:
            continue

        bits = raw.split()

        url = bits[0]
        descriptor = " ".join(
            bits[1:]
        )

        url = add_asset_version(url)

        pieces.append(
            url
            + (
                " " + descriptor
                if descriptor
                else ""
            )
        )

    return ", ".join(pieces)


def process_html(path):
    original = path.read_text(
        encoding="utf-8"
    )

    s = normalize_head(
        original
    )

    s = SCRIPT_PATTERN.sub(
        lambda m:
            m.group(1)
            + add_asset_version(
                m.group(2)
            )
            + m.group(3),
        s
    )

    s = IMG_PATTERN.sub(
        lambda m:
            m.group(1)
            + add_asset_version(
                m.group(2)
            )
            + m.group(3),
        s
    )

    s = SRCSET_PATTERN.sub(
        lambda m:
            m.group(1)
            + version_srcset(
                m.group(2)
            )
            + m.group(3),
        s
    )

    def replace_link(m):
        url = m.group(2)

        if is_external(url):
            return m.group(0)

        # CSS / icon / manifest etc.
        return (
            m.group(1)
            + add_asset_version(url)
            + m.group(3)
        )

    s = LINK_PATTERN.sub(
        replace_link,
        s
    )

    s = ANCHOR_PATTERN.sub(
        lambda m:
            m.group(1)
            + add_page_version(
                m.group(2)
            )
            + m.group(3),
        s
    )

    s = CSS_URL_PATTERN.sub(
        lambda m:
            m.group(1)
            + add_asset_version(
                m.group(2)
            )
            + m.group(3),
        s
    )

    if s != original:
        path.write_text(
            s,
            encoding="utf-8"
        )

        return True

    return False


# ============================================================
# CSS VERSIONING
# ============================================================

def process_css(path):
    original = path.read_text(
        encoding="utf-8"
    )

    s = CSS_URL_PATTERN.sub(
        lambda m:
            m.group(1)
            + add_asset_version(
                m.group(2)
            )
            + m.group(3),
        original
    )

    if s != original:
        path.write_text(
            s,
            encoding="utf-8"
        )
        return True

    return False


# ============================================================
# JS LOCAL ASSET STRINGS
#
# Important for models.js logos etc.
# ============================================================

def process_js(path):
    # Do not rewrite the tool-generated build/version logic
    # inside unrelated external URLs.
    original = path.read_text(
        encoding="utf-8"
    )

    def repl(m):
        quote1 = m.group(1)
        url = m.group(2)
        quote2 = m.group(3)

        if is_external(url):
            return m.group(0)

        return (
            quote1
            + add_asset_version(url)
            + quote2
        )

    s = JS_ASSET_STRING_PATTERN.sub(
        repl,
        original
    )

    if s != original:
        path.write_text(
            s,
            encoding="utf-8"
        )
        return True

    return False


# ============================================================
# WALK SITE
# ============================================================

skip_dirs = {
    ".git",
    ".github",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
}

changed = []


for root in roots:

    for p in root.rglob("*"):

        if not p.is_file():
            continue

        if any(
            part in skip_dirs
            for part in p.parts
        ):
            continue

        try:
            relative = str(
                p.relative_to(ROOT)
            )
        except ValueError:
            continue

        if p.suffix.lower() == ".html":

            if process_html(p):
                changed.append(relative)

        elif p.suffix.lower() == ".css":

            if process_css(p):
                changed.append(relative)

        elif p.suffix.lower() == ".js":

            # Generated JS data files benefit from
            # versioned embedded logo references too.
            if process_js(p):
                changed.append(relative)


print()
print("ZORIX SITE CACHE BUST")
print("---------------------")
print("Build version:", version)
print("HTML freshness check: enabled")
print("HTML no-cache meta: enabled")
print("JS versioning: enabled")
print("CSS versioning: enabled")
print("Image versioning: enabled")
print("JS embedded asset versioning: enabled")
print("Internal page versioning: enabled")
print("Files changed:", len(changed))

for name in changed:
    print(" ", name)

