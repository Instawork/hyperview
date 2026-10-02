#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.."; pwd -P)
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT_DIR"

yarn test
yarn version "$1"
VERSION=$(node -p "require('./package.json').version")
git add package.json
git commit -m "v$VERSION"
git tag "v$VERSION"
yarn npm publish
cd "$REPO_ROOT/demo"
yarn add --exact "hyperview@$VERSION"
git add package.json yarn.lock
git commit -m "chore(demo): update Hyperview to v$VERSION"
cd "$ROOT_DIR"
git push --follow-tags
