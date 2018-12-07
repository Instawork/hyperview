[![CircleCI](https://circleci.com/gh/Instawork/hyperview.svg?style=svg)](https://circleci.com/gh/Instawork/hyperview)

![logo](./demo/assets/images/icon_small.png)
# Hyperview: Native mobile apps, as easy as creating a website.

[Hyperview](https://hyperview.org) is a new hypermedia format and React Native client for developing server-driven mobile apps.

- **Serve your app as XML**: On the web, pages are rendered in a browser by fetching HTML content from a server. With Hyperview, screens are rendered in your mobile app by fetching Hyperview XML (HXML) content from a server. HXML's design reflects the UI and interaction patterns of today's mobile interfaces.
- **Work with any backend web technology**: Use battle-tested web technologies like Django, Rails, or Node. Any HTTP server can host a Hyperview app. You can even deploy your app as a collection of static XML files if you want!
- **Update your apps instantly by deploying your backend**: Say goodbye to slow release cycles and long app store review times. With Hyperview, your backend controls your app's layout, content, and available actions. The means you can update any aspect of your app with a server-side change. True CI/CD is finally attainable for mobile development.
- **Forget about API versioning and backwards compatibility**:  Unlike traditional native apps, every user always runs the most recent version of your code. With no version fragmentation, you can be more productive by eliminating the need to support and maintain older app versions.

See the [Hyperview website](https://hyperview.org) for more information about Hyperview and Hyperview XML.

## Hyperview XML
- See examples of how to create rich, interactive apps with Hyperview XML [here](https://hyperview.org/docs/example_navigation)
- See the full references for Hyperview XML [here](https://hyperview.org/docs/reference_screen)

## Hyperview React Native Client
This repo contains a React Native implementation of the Hyperview Client. It can either be integrated into an existing React Native app, or used to create a self-contained RN app.

### Requirements
The Hyperview client only has two required dependencies:
- url-parse 1.4.3
- xmldom 0.1.27

More importantly, the client is designed to be incorporated into an existing React Native project, and thus has the following peer dependencies:
- react >= 16.2.0
- react-native >= 0.52.2
- react-native-keyboard-aware-scrollview 2.0.0

### Getting Started
This repo contains an example XML server that serves Hyperview XML to showcase the available features. 
It also contains a demo Expo project that can connect to the example XML server, or any other Hyperview endpoint.

#### Running the example server
From the repo root directory:
```
yarn test:xmlserver
```
This will start an HTTP server listening on port 8085. It simply serves files from the [./examples](/examples) directory. You can view the XML from a web browser: http://localhost:8085/index.xml

You can modify or add files in [./examples](/examples) and the server will update without restarting.

#### Starting the demo app
First, install the demo dependencies and start the development server. From thr repo root directory:
```
cd demo
yarn
yarn start
```
The development server should open a webpage (http://localhost:19002) that shows logs and provides options for running the app in the iOS simulator, Android Virtual Device, or on an actual device.
- To run the demo app in the iOS simulator, press the "Run on iOS simulator" link in the left-hand toolbar.
- To run the demo app on an Android Virtual Device, press the "Run on Android device/emulator" link in the left-hand toolbar.
- To run the demo app on an actual device, scan the QR code with your device's camera, then open the link in the Expo app.
> NOTE: To access the example server from an actual device, you will need to update `navigation/AppNavigator.js`. In that file, `initialRouteParams` is set to `http://0.0.0.0:8085/index.xml`. Change the URL host to the IP of the machine running the example server.

The XML will from the example server should appear in the app:
![example](./demo/assets/images/example.gif)
