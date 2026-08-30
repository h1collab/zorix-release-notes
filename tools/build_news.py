#!/usr/bin/env python3
import json
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "releases.json"
JS = ROOT / "releases.js"
RSS = ROOT / "rss.xml"

items = json.loads(DATA.read_text(encoding="utf-8"))

items.sort(key=lambda x: x.get("date", ""), reverse=True)

JS.write_text(
    "window.ZORIX_RELEASES = " +
    json.dumps(items, ensure_ascii=False, indent=2) +
    ";\n",
    encoding="utf-8"
)

rss_items = []
for item in items[:50]:
    title = escape(item.get("title", "Untitled"))
    body = escape(item.get("content", ""))
    date = escape(item.get("date", ""))
    rss_items.append(f"""
    <item>
      <title>{title}</title>
      <description>{body}</description>
      <pubDate>{date}</pubDate>
      <link>https://updates.zorix.it/</link>
      <guid>https://updates.zorix.it/#{date}-{title}</guid>
    </item>""")

rss = f'''<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Zorix Updates</title>
  <link>https://updates.zorix.it/</link>
  <description>Zorix release notes and updates</description>
  {''.join(rss_items)}
</channel>
</rss>
'''

RSS.write_text(rss, encoding="utf-8")

print(f"Built {len(items)} releases.")
