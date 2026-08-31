#!/usr/bin/env python3

from pathlib import Path
import runpy


ROOT = Path(__file__).resolve().parents[1]

builder = (
    ROOT /
    "tools/build_open_source.py"
)


print(
    "Open-source data is Zorix-owned and local-only."
)

print(
    "No external model registry will be queried."
)


if builder.exists():

    runpy.run_path(
        str(builder),
        run_name="__main__"
    )

else:

    print(
        "WARNING: build_open_source.py missing"
    )
