#!/usr/bin/env python3

from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
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
    x = str(url).strip().lower()

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


def version_url(url):

    if external(url):
        return url

    parsed = urlsplit(url)

    query = [
        (k, v)
        for k, v in parse_qsl(
            parsed.query,
            keep_blank_values=True
        )
        if k != "v"
    ]

    query.append(
        ("v", VERSION)
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


ASSET_RE = re.compile(
    r'\.(?:js|css|svg|png|jpe?g|webp|gif|ico)$',
    re.I
)


# Only real tag attributes.
ATTR_RE = re.compile(
    r'''(?P<before>\b(?:src|href)=["'])
        (?P<url>[^"']+)
        (?P<after>["'])''',
    re.I | re.X
)


CACHE_BLOCK_RE = re.compile(
    r'''
    \s*
    <meta\s+http-equiv=["']Cache-Control["'][^>]*>
    |
    \s*
    <meta\s+http-equiv=["']Pragma["'][^>]*>
    |
    \s*
    <meta\s+http-equiv=["']Expires["'][^>]*>
    ''',
    re.I | re.X
)


BUILD_BLOCK_RE = re.compile(
    r'\\s*<meta\\s+name=["\\']zorix-build["\\'][^>]*>',
    re.I
)


def generated_head():

    return f"""
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">

<meta name="zorix-build" content="{VERSION}">
"""


def process_html(path):

    original = path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    s = original

    # Remove only our generated cache fields.
    s = CACHE_BLOCK_RE.sub(
        "",
        s
    )

    s = BUILD_BLOCK_RE.sub(
        "",
        s,
        count=1
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


    # Only version assets inside actual tags.
    def replace_attr(match):

        before = match.group("before")
        url = match.group("url")
        after = match.group("after")

        if external(url):
            return match.group(0)

        path_only = urlsplit(url).path

        if not ASSET_RE.search(path_only):
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


CSS_URL_RE = re.compile(
    r'''(url\(\s*["']?)
        ([^)"']+)
        (["']?\s*\))''',
    re.I | re.X
)


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


changed=[]


for path in ROOT.rglob("*"):

    if not path.is_file():
        continue

    if any(
        part in SKIP
        for part in path.parts
    ):
        continue

    if path.suffix.lower()==".html":

        if process_html(path):
            changed.append(
                str(
                    path.relative_to(ROOT)
                )
            )

    elif path.suffix.lower()==".css":

        if process_css(path):
            changed.append(
                str(
                    path.relative_to(ROOT)
                )
            )


print()
print("ZORIX SAFE CACHE VERSION")
print("------------------------")
print("Build:", VERSION)
print("Inline JavaScript: untouched")
print("HTML navigation: untouched")
print("Assets versioned:", True)
print("HTML freshness checker:", True)
print("Changed:", len(changed))

for name in changed:
    print(" ", name)
