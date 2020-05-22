#!/usr/bin/env bash

rm -rf build/schema
mkdir build/schema
cp ../schema/*.xsd build/schema
sed -i .bak 's/schemaLocation="/schemaLocation="https:\/\/hyperview.org\/schema\//g' build/schema/*.xsd
rm build/schema/*.bak
