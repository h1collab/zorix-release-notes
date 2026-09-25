#!/usr/bin/env python3

from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
import argparse
import hashlib
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]

SKIP = {
    ".git",
    ".github",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
}

ASSET_RE = re.compile(r'\.(?:js|css|svg|png|jpe?g|webp|gif|ico)$', re.I)
ATTR_RE = re.compile(
    r'''(?P<before>\b(?:src|href)=["'])(?P<url>[^"']+)(?P<after>["'])''',
    re.I,
)
CSS_URL_RE = re.compile(
    r'''(url\(\s*["']?)([^)"']+)(["']?\s*\))''',
    re.I,
)
CACHE_META_RE = re.compile(
    r'''\s*<meta\s+http-equiv=["']Cache-Control["'][^>]*>'''
    r'''|\s*<meta\s+http-equiv=["']Pragma["'][^>]*>'''
    r'''|\s*<meta\s+http-equiv=["']Expires["'][^>]*>'''
    r'''|\s*<meta\s+name=["']zorix-build["'][^>]*>''',
    re.I,
)


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


def generated_head():
    return (
        '\n<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0">\n'
        '<meta http-equiv="Pragma" content="no-cache">\n'
        '<meta http-equiv="Expires" content="0">\n'
    )


def resolve_local(owner, url):
    parsed = urlsplit(url)
    raw = parsed.path
    if not raw:
        return None

    if raw.startswith("/"):
        candidate = ROOT / raw.lstrip("/")
    else:
        candidate = owner.parent / raw

    try:
        candidate = candidate.resolve()
        candidate.relative_to(ROOT.resolve())
    except Exception:
        return None

    return candidate if candidate.is_file() else None


def digest_file(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()[:12]


def version_url(owner, url):
    if external(url):
        return url

    parsed = urlsplit(url)
    if not ASSET_RE.search(parsed.path):
        return url

    local = resolve_local(owner, url)
    if local is None:
        return url

    query = [
        (key, value)
        for key, value in parse_qsl(parsed.query, keep_blank_values=True)
        if key != "v"
    ]
    query.append(("v", digest_file(local)))

    return urlunsplit(
        (
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            urlencode(query),
            parsed.fragment,
        )
    )


def strip_old_refresh_scripts(s):
    def remove_refresh_script(match):
        block = match.group(0)
        if (
            "build-version.txt" in block
            or "checkFreshness" in block
            or ("__v" in block and "location.replace" in block)
        ):
            return ""
        return block

    return re.sub(
        r'<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?</script>',
        remove_refresh_script,
        s,
        flags=re.I,
    )


def process_html(path):
    original = path.read_text(encoding="utf-8", errors="ignore")
    s = CACHE_META_RE.sub("", original)
    s = strip_old_refresh_scripts(s)

    head = re.search(r'<head\b[^>]*>', s, re.I)
    if head:
        s = s[:head.end()] + generated_head() + s[head.end():]

    def replace_attr(match):
        return (
            match.group("before")
            + version_url(path, match.group("url"))
            + match.group("after")
        )

    s = ATTR_RE.sub(replace_attr, s)

    if s != original:
        path.write_text(s, encoding="utf-8")
        return True
    return False


def process_css(path):
    original = path.read_text(encoding="utf-8", errors="ignore")

    def replace(match):
        return (
            match.group(1)
            + version_url(path, match.group(2))
            + match.group(3)
        )

    s = CSS_URL_RE.sub(replace, original)

    if s != original:
        path.write_text(s, encoding="utf-8")
        return True
    return False


def site_asset_manifest():
    rows = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP for part in path.parts):
            continue
        if path.suffix.lower() not in {
            ".js", ".css", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico"
        }:
            continue
        rows.append((str(path.relative_to(ROOT)), digest_file(path)))

    rows.sort()
    h = hashlib.sha256()
    for name, digest in rows:
        h.update(name.encode("utf-8"))
        h.update(b"\0")
        h.update(digest.encode("ascii"))
        h.update(b"\n")
    return h.hexdigest()[:16]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--stage", action="store_true")
    args = parser.parse_args()

    changed = []

    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP for part in path.parts):
            continue

        if path.suffix.lower() == ".html":
            if process_html(path):
                changed.append(path)
        elif path.suffix.lower() == ".css":
            if process_css(path):
                changed.append(path)

    build_version = site_asset_manifest()
    version_path = ROOT / "build-version.txt"
    old_version = version_path.read_text(encoding="utf-8").strip() if version_path.exists() else ""
    if old_version != build_version:
        version_path.write_text(build_version + "\n", encoding="utf-8")
        changed.append(version_path)

    if args.stage and changed:
        rel = [str(path.relative_to(ROOT)) for path in changed]
        subprocess.run(["git", "add", "--", *rel], cwd=ROOT, check=True)

    print()
    print("ZORIX CONTENT-HASH ASSET VERSIONING")
    print("-----------------------------------")
    print("Build manifest:", build_version)
    print("Automatic page reload: DISABLED")
    print("Navigation rewriting: DISABLED")
    print("Per-request Date.now cache busting: DISABLED")
    print("Content-hash asset versioning: ENABLED")
    print("Changed files:", len(changed))
    for path in changed:
        print(" ", path.relative_to(ROOT))


if __name__ == "__main__":
    main()
