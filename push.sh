#!/usr/bin/env bash
set -e

MSG="${1:-update showroom}"

git add .
git commit -m "$MSG" || echo "Nothing to commit"
git push
