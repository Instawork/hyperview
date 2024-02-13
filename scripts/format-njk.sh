#!/usr/bin/env bash

if [[ `uname` == "Darwin" ]]; then
  TEMPLATE_FILES=`find -E . -path ./node_modules -prune -o -regex ".*\\.njk" | grep examples`
else
  TEMPLATE_FILES=`find . -path ./node_modules -prune -o -regextype sed -regex ".*\\.\\njk" | grep examples`
fi

EXCLUDED_FILES=()

FILES_TO_LINT=($(LC_ALL=C comm -13 <(printf '%s\n' "${EXCLUDED_FILES[@]}" | LC_ALL=C sort) <(printf '%s\n' "${TEMPLATE_FILES[@]}" | LC_ALL=C sort)))

if [[ -n $FILES_TO_LINT ]]; then
  djhtml -t 2 "${FILES_TO_LINT[@]}" $1
fi
