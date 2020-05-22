#!/usr/bin/env bash

mkdir build/Hyperview/schema
cp ../schema/*.xsd build/Hyperview/schema
# Replace local schema location references with production references.
sed -i 's/schemaLocation=\"/schemaLocation=\"https:\/\/hyperview.org\/schema\//g' build/Hyperview/schema/hyperview.xsd
