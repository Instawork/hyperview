#!/usr/bin/env bash

# Exit on error
set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Get the project root directory (parent of scripts)
PROJECT_DIR="$( cd "$SCRIPT_DIR/../.." &> /dev/null && pwd )"

if [[ `uname` == "Darwin" ]]; then
  TEMPLATE_FILES=`find -E "$PROJECT_DIR" -path "$PROJECT_DIR/hyperview/node_modules" -prune -o -regex ".*\\.njk" | grep demo/backend`
else
  TEMPLATE_FILES=`find "$PROJECT_DIR" -path "$PROJECT_DIR/hyperview/node_modules" -prune -o -regextype sed -regex ".*\\.\\njk" | grep demo/backend`
fi

# Check if TEMPLATE_FILES is empty
if [[ -z "$TEMPLATE_FILES" ]]; then
  echo "Error: No template files found"
  exit 1
fi

EXCLUDED_FILES=()

FILES_TO_LINT=($(LC_ALL=C comm -13 <(printf '%s\n' "${EXCLUDED_FILES[@]}" | LC_ALL=C sort) <(printf '%s\n' "${TEMPLATE_FILES[@]}" | LC_ALL=C sort)))

if [[ -n $FILES_TO_LINT ]]; then
  djhtml -t 2 "${FILES_TO_LINT[@]}" $1 || {
    echo "Error: djhtml formatting failed"
    exit 1
  }
fi
