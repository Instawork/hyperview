find examples -type f -name '*.xml' -exec sed -i "" 's/id=/aaaaa=/g' {} +

/usr/local/bin/tidy -config tidy.cfg -m examples/*.xml examples/**/*.xml

find examples -type f -name '*.xml' -exec sed -i "" 's/aaaaa=/id=/g' {} +
