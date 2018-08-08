# React Native Hyperview Client

This is a RN-based implementation of a Hyperview Client, meant to be integrated into an existing React Native app. The only requirements:
- RN 0.55+
- React Native Navigation 2.X+

See the [Design Doc](https://instawork.atlassian.net/wiki/spaces/~adam/pages/610074909/Hyperview) for more information about Hyperview XML and Hyperview.


## Installing
Clone the repo, go into the directory, and run
```
yarn
```

## Running the Demo
To load the demo backend, run the demo server from a shell:
```
yarn demo
```
This will start a server on port 8080. It simply serves the files from the `./examples` directory.

To access the demo Hyperview XML resources, run the client either on a device or in the iOS simulator:
```
yarn start
```
To run on an iOS device, download the Expo app, then scan the QR code in the terminal with the Camera app. This should deep link into the Expo app, configured to load the code from your machine.

To run the app in the iOS simulator, press 'i' in the terminal once the server is started.
