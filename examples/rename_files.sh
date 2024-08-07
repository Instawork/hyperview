#!/bin/bash
find . -type f -name "_*" | while read file; do
    dir=$(dirname "$file")
    base=$(basename "$file")
    new_base="${base#_}"
    mv "$file" "$dir/$new_base"
done

