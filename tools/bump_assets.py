#!/usr/bin/env python3

from pathlib import Path
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


# ============================================================
# BUILD VERSION
# ============================================================

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


# ============================================================
# URL HELPERS
# ============================================================

def external(url):

    value = str(url).strip().lower()

    return (
        value.startswith("http://")
        or value.startswith("https://")
        or value.startswith("//")
        or value.startswith("data:")
        or value.startswith("mailto:")
        or value.startswith("tel:")
        or value.startswith("javascript:")
        or value.startswith("#")
    )


def version_url(url):

    if external(url):
        return url

    parsed = urlsplit(url)

    query = [
        (key, value)
        for key, value in parse_qsl(
            parsed.query,
            keep_blank_values=True
        )
        if key != "v"
    ]

    query.append(
        (
            "v",
            VERSION
        )
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


# ============================================================
# ASSETS
# ============================================================

ASSET_RE = re.compile(
    r'\.(?:js|css|svg|png|jpe?g|webp|gif|ico)$',
    re.I
)


ATTR_RE = re.compile(
    r'''(?P<before>\b(?:src|href)=["'])
        (?P<url>[^"']+)
        (?P<after>["'])''',
    re.I | re.X
)


CSS_URL_RE = re.compile(
    r'''(url\(\s*["']?)
        ([^)"']+)
        (["']?\s*\))''',
    re.I | re.X
)


# ============================================================
# OLD CACHE META
# ============================================================

CACHE_META_RE = re.compile(
    r'''
    \s*<meta\s+http-equiv=["']Cache-Control["'][^>]*>
    |
    \s*<meta\s+http-equiv=["']Pragma["'][^>]*>
    |
    \s*<meta\s+http-equiv=["']Expires["'][^>]*>
    |
    \s*<meta\s+name=["']zorix-build["'][^>]*>
    ''',
    re.I | re.X
)


def generated_head():

    return f'''
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="zorix-build" content="{VERSION}">
'''


# ============================================================
# HTML
# ============================================================

def process_html(path):

    original = path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    s = original


    # Remove previous generated meta only.
    s = CACHE_META_RE.sub(
        "",
        s
    )


    # Absolutely remove any remaining old auto-refresh script.
    def remove_refresh_script(match):

        block = match.group(0)

        if (
            "build-version.txt" in block
            or "checkFreshness" in block
            or (
                "__v" in block
                and "location.replace" in block
            )
        ):
            return ""

        return block


    s = re.sub(
        r'<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?</script>',
        remove_refresh_script,
        s,
        flags=re.I
    )


    head = re.search(
        r'<head\b[^>]*>',
        s,
        re.I
    )

    if head:

        s = (
            s[:head.end()]
            + "\n"
            + generated_head()
            + s[head.end():]
        )


    # Only touch actual src/href attributes pointing to assets.
    def replace_attr(match):

        before = match.group("before")
        url = match.group("url")
        after = match.group("after")


        if external(url):
            return match.group(0)


        path_only = urlsplit(
            url
        ).path


        if not ASSET_RE.search(
            path_only
        ):
            return match.group(0)


        return (
            before
            + version_url(url)
            + after
        )


    s = ATTR_RE.sub(
        replace_attr,
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
# CSS
# ============================================================

def process_css(path):

    original = path.read_text(
        encoding="utf-8",
        errors="ignore"
    )


    def replace(match):

        url = match.group(2)


        if external(url):
            return match.group(0)


        if not ASSET_RE.search(
            urlsplit(url).path
        ):
            return match.group(0)


        return (
            match.group(1)
            + version_url(url)
            + match.group(3)
        )


    s = CSS_URL_RE.sub(
        replace,
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

changed = []


for path in ROOT.rglob("*"):

    if not path.is_file():
        continue


    if any(
        part in SKIP
        for part in path.parts
    ):
        continue


    if path.suffix.lower() == ".html":

        if process_html(path):

            changed.append(
                str(
                    path.relative_to(ROOT)
                )
            )


    elif path.suffix.lower() == ".css":

        if process_css(path):

            changed.append(
                str(
                    path.relative_to(ROOT)
                )
            )


print()
print("ZORIX STATIC ASSET VERSIONING")
print("-----------------------------")
print("Build:", VERSION)
print("Automatic HTML refresh: DISABLED")
print("__v navigation rewriting: DISABLED")
print("Inline JavaScript rewriting: DISABLED")
print("JS/CSS/image cache busting: ENABLED")
print("Changed files:", len(changed))

for name in changed:
    print(" ", name)
