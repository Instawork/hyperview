---
id: guide_installation
title: Getting started
sidebar_label: Getting started
---

To get started with Hyperview, you need both a Hyperview backend server (that responds to requests with [HXML](/docs/guide_installation)) and a mobile app to host the RN client. The Hyperview codebase includes a demo of the backend and mobile app to help you get started quickly.

> Make sure [yarn is installed](https://yarnpkg.com/lang/en/docs/install) on your system before continuing.

## 1. Clone the Github repository

```
> git clone https://github.com/instawork/hyperview
```

This repository contains:

- The React Native client code for Hyperview
- An XML server with examples of many Hyperview features
- A demo Expo project that can connect to the example XML server, or any other Hyperview endpoint.
- all of the reference docs on this website

## 2. Run the example server

From the repo root directory:

```
> yarn
> yarn test:xmlserver
```

This will start an HTTP server listening on port 8085. You cen verify that the server works by visiting [http://0.0.0.0:8085/index.xml](http://0.0.0.0:8085/index.xml) in a web browser.

## 3. Start the demo app

In a separate shell, install the demo dependencies and start the development server. From the repo root directory:

```
> cd demo
> yarn
```

The next step depends on whether you want to run the demo app in the iOS simulator, on an Android Virtual Device, or on a physical mobile device.

#### Running on the iOS simulator

From the `demo/` directory:

```
> yarn ios
```

This will open the iOS simulator and install the demo app in the simulator. It will then start the Expo development server to load the demo app.

#### Running on an Android Virtual Device

From the `demo/` directory:

```
> yarn android
```

This will open an AVD and install the demo app in the emulator. It will then start the Expo development server to load the demo app.

#### Running on a physical device

On your physical mobile device, install the Expo client

- [iOS App Store](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8)
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

Make sure your mobile device and development machine are connected to the same network.

Open [/demo/src/constants.js](/demo/src/constants.js) in a text editor. In `ENTRY_POINT_URL`, replace the host in the url (`http://0.0.0.0:8085/index.xml`) with the IP of your machine. This is needed in order for your physical device to be able to request the example XML files from your development machine.

From the `demo/` directory on your development machine:

```
> yarn start
```

This command will start an Expo development server and open a webpage (http://localhost:19002). This webpage will display a QR code.

![expo](/img/guide_installation1.png)

- On your iOS device, open the Camera app and point it at the QR code on your screen. The Camera app should show an "Open in Expo" notification. Tap this notification.
- On your Android device, use the Expo app to scan the QR code on your screen.

## 4. You're all set!

Whether you're using a physical device or simulator, you should now see a Hyperview screen rendered from the example server:

![final](/img/guide_installation2.gif)

The example server responds with files in the [./examples](/examples) directory. You can modify or add files in [./examples](/examples) and the server will update without restarting. to view your changes, simply navigate back to the changed page.

### Troubleshooting

> This version of the Expo app is out of date. Uninstall the app and run again to upgrade.
