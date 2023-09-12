# Demo

This directory contains the code to run an expo app that will showcase the various capabilities of Hyperview.

## Updating dependencies

The following commands should in theory suffice to recreate the demo app without having to manually manipulate any files.
However, it's possible that some of these commands will need to be tweaked. If that's the case, make sure to update this file once the command has been adjusted!

```sh
mv demo/ demo-old
npx --yes create-expo-app demo --template blank
cd demo/
npx expo install @react-native-community/datetimepicker @react-native-picker/picker react-native-gesture-handler react-native-safe-area-context react-native-screens react-native-web react-native-webview
yarn add @babel/preset-env @react-navigation/bottom-tabs @react-navigation/native @react-navigation/stack @types/react moment react-dom typescript hyperview
yarn add @expo/webpack-config -D
yarn add react-native-keyboard-aware-scrollview@2.1.0 --exact
cd ..
mv demo-old/src demo
mv demo-old/App.js demo
mv demo-old/assets/* demo/assets
mv demo-old/webpack.config.js demo
mv demo-old/tsconfig.json demo
mv demo-old/README.md demo
rm -rf demo-old
rm demo/package-lock.json
```
