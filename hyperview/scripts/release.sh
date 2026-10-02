#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.."; pwd -P)
cd "$ROOT_DIR"

yarn test
yarn version "$1"
VERSION=$(node -p "require('./package.json').version")
git add package.json
git commit -m "v$VERSION"
git tag "v$VERSION"
yarn npm publish
git push --follow-tags
