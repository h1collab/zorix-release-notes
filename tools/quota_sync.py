#!/data/data/com.termux/files/usr/bin/bash

set -e

REPO="$HOME/projects/zorix-release-notes"

cd "$REPO"

python tools/quota_sync.py "$@"

python tools/bump_assets.py

git add \
  data/public-quota.json \
  number-of-calls/quota.js \
  number-of-calls/quota/index.html \
  number-of-calls/index.html

if git diff --cached --quiet; then

  echo
  echo "No quota changes to publish."

else

  git commit -m "Sync public quota usage"

  git push

fi

echo
echo "========================================"
echo "PUBLIC QUOTA PUBLISHED"
echo "https://updates.zorix.it/number-of-calls/quota/"
echo "========================================"
