find examples -type f -name '*.xml' -exec sed -i "" 's/id=/aaaaa=/g' {} +

find examples -type f -name '*.xml' | xargs /usr/local/bin/tidy -config tidy.cfg -m

find examples -type f -name '*.xml' -exec sed -i "" 's/aaaaa=/id=/g' {} +
