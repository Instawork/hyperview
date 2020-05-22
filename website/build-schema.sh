#!/usr/bin/env bash

rm -rf build/schema
mkdir build/schema
cp ../schema/*.xsd build/schema
# Replace local schema location references with production references.
#sed -i .bak 's/schemaLocation=\"/schemaLocation=\"https:\/\/hyperview.org\/schema\//g' build/schema/*.xsd
#rm build/schema/*.bak
