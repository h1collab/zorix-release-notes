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

pattern = re.compile(
    r'(<script\s+src=["\'])([^"\']+\.js)(?:\?v=[^"\']*)?(["\']\s*>\s*</script>)',
    re.I
)

changed = 0

for root in roots:
    if not root.exists():
        continue

    for p in root.rglob("*.html"):
        s = p.read_text(encoding="utf-8")

        def repl(m):
            src = m.group(2)

            if (
                src.startswith("http://")
                or src.startswith("https://")
                or src.startswith("//")
            ):
                return m.group(0)

            return (
                m.group(1)
                + src
                + "?v="
                + version
                + m.group(3)
            )

        new = pattern.sub(repl, s)

        if new != s:
            p.write_text(new, encoding="utf-8")
            changed += 1

print("Asset version:", version)
print("Pages updated:", changed)
