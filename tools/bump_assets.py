#!/usr/bin/env python3

from pathlib import Path
import re
import time

ROOT = Path(__file__).resolve().parents[1]

roots = [
    ROOT / "number-of-calls",
    ROOT / "zorix",
    ROOT / "anthropic",
    ROOT / "openai",
    ROOT / "google",
    ROOT / "deepseek",
    ROOT / "tencent",
    ROOT / "xiaomi",
    ROOT / "zai",
]

version = str(int(time.time()))

# ------------------------------------------------------------
# <script src="file.js">
# ------------------------------------------------------------

script_pattern = re.compile(
    r'(<script\s+src=["\'])'
    r'([^"\']+\.js)'
    r'(?:\?v=[^"\']*)?'
    r'(["\']\s*>\s*</script>)',
    re.I
)

# ------------------------------------------------------------
# <img src="file.svg">
# Also png/jpg/jpeg/webp/gif
# ------------------------------------------------------------

image_pattern = re.compile(
    r'(<img\b[^>]*\bsrc=["\'])'
    r'([^"\']+\.(?:svg|png|jpe?g|webp|gif))'
    r'(?:\?v=[^"\']*)?'
    r'(["\'])',
    re.I
)

# ------------------------------------------------------------
# href="file.svg"
# Useful if an SVG is directly linked.
# ------------------------------------------------------------

href_asset_pattern = re.compile(
    r'(\bhref=["\'])'
    r'([^"\']+\.(?:svg|png|jpe?g|webp|gif))'
    r'(?:\?v=[^"\']*)?'
    r'(["\'])',
    re.I
)

# ------------------------------------------------------------
# CSS url(...)
# ------------------------------------------------------------

css_url_pattern = re.compile(
    r'(url\(\s*["\']?)'
    r'([^)"\']+\.(?:svg|png|jpe?g|webp|gif))'
    r'(?:\?v=[^)"\']*)?'
    r'(["\']?\s*\))',
    re.I
)


def is_external(src):
    return (
        src.startswith("http://")
        or src.startswith("https://")
        or src.startswith("//")
        or src.startswith("data:")
    )


def add_version(src):
    if is_external(src):
        return src

    return src + "?v=" + version


changed_files = []


for root in roots:

    if not root.exists():
        continue

    # HTML
    for p in root.rglob("*.html"):

        original = p.read_text(
            encoding="utf-8"
        )

        s = original

        s = script_pattern.sub(
            lambda m:
                m.group(1)
                + add_version(m.group(2))
                + m.group(3),
            s
        )

        s = image_pattern.sub(
            lambda m:
                m.group(1)
                + add_version(m.group(2))
                + m.group(3),
            s
        )

        s = href_asset_pattern.sub(
            lambda m:
                m.group(1)
                + add_version(m.group(2))
                + m.group(3),
            s
        )

        s = css_url_pattern.sub(
            lambda m:
                m.group(1)
                + add_version(m.group(2))
                + m.group(3),
            s
        )

        if s != original:

            p.write_text(
                s,
                encoding="utf-8"
            )

            changed_files.append(
                str(
                    p.relative_to(ROOT)
                )
            )


    # CSS files
    for p in root.rglob("*.css"):

        original = p.read_text(
            encoding="utf-8"
        )

        s = css_url_pattern.sub(
            lambda m:
                m.group(1)
                + add_version(m.group(2))
                + m.group(3),
            original
        )

        if s != original:

            p.write_text(
                s,
                encoding="utf-8"
            )

            changed_files.append(
                str(
                    p.relative_to(ROOT)
                )
            )


print("Asset version:", version)
print("Files updated:", len(changed_files))

for name in changed_files:
    print(" ", name)
