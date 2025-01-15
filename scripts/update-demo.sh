#!/usr/bin/env bash

ROOT_DIR=$(cd "$(dirname "$0")/..";pwd -P)
cd $ROOT_DIR

# Move app code in temp dir and recreate app
rm -rf demo-old
mv demo demo-old
yarn create expo-app demo --yes --template expo-template-blank-typescript

# Recreate various entries of package.json
echo "const oldPackage = require('./demo-old/package.json'); \
      const newPackage = require('./demo/package.json'); \
      newPackage.main = oldPackage.main; \
      newPackage.homepage = oldPackage.homepage; \
      newPackage.resolutions = oldPackage.resolutions; \
      newPackage.scripts = oldPackage.scripts; \
      const fs = require('fs'); \
      fs.writeFileSync('./demo/package.json', JSON.stringify(newPackage, null, '  '));\
     " | node

cd demo/

# Install Expo dependencies
npx expo install \
  @react-native-community/datetimepicker \
  @react-native-picker/picker \
  expo-constants \
  react-native-gesture-handler \
  react-native-maps \
  react-native-safe-area-context \
  react-native-screens \
  react-native-web \
  react-native-webview

# Install Hyperview dependencies
yarn add \
  @googlemaps/js-api-loader \
  hyperview \
  moment \
  react-dom \
  react-google-maps \
  react-native-svg \
  react-native-web-maps

# Install Hyperview dependencies with exact versions
yarn add --exact \
  @react-navigation/bottom-tabs@6.5.7 \
  @react-navigation/native@6.1.6 \
  @react-navigation/stack@6.3.16 \
  react-native-keyboard-aware-scrollview@2.1.0

# Make Hyperview symlinkable
cd $ROOT_DIR
yarn link
cd demo
yarn link hyperview

# Install dev dependencies
yarn add -D \
  @11ty/eleventy \
  @11ty/eleventy-server-browsersync \
  @babel/preset-env \
  @babel/preset-env \
  @expo/webpack-config \
  @expo/webpack-config \
  @faker-js/faker \
  @types/react \
  gh-pages \
  nunjucks \
  ts-node \
  typescript

# Install dev dependencies with exact versions
yarn add -D --exact \
  @babel/eslint-parser@7.13.4 \
  @prettier/plugin-xml@0.13.0 \
  babel-eslint@10.1.0 \
  eslint-plugin-instawork@0.12.0 \
  eslint@7.20.0 \
  prettier@2.2.1 \
  pretty-quick@3.1.0

# Auto fix dependency conflicts
npx expo install --fix

cd ..

# Remove unwanted files
rm demo/assets/splash-icon.png
rm demo/app.json

# Move app files back
mv demo-old/.eleventy* demo
mv demo-old/.gitignore demo
mv demo-old/@types demo
mv demo-old/app.config.ts demo
mv demo-old/App.tsx demo
mv demo-old/assets/* demo/assets
mv demo-old/babel.config.js demo
mv demo-old/backend demo
mv demo-old/README.md demo
mv demo-old/schema demo
mv demo-old/scripts demo
mv demo-old/src demo
mv demo-old/tsconfig.json demo
mv demo-old/webpack.config.js demo
mv demo-old/webpack.config.ts demo

# Delete temp dir
rm -rf demo-old
