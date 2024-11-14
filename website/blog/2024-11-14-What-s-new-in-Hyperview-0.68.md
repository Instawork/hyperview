---
author: Florent Bonomo
authorURL: https://github.com/flochtililoch
title: What's New in Hyperview v0.86.0
---

Hello Hyperview enthusiasts! We're thrilled to announce the release of Hyperview v0.86.0, packed with enhancements and new features designed to make your development experience even smoother. Whether you're a seasoned developer or just starting with Hyperview, there's something in this update for everyone. Let's dive into the highlights!

### Breaking Changes
In this release, we have a notable breaking change: the removal of the share behavior action from the core. This change streamlines our codebase and paves the way for more robust functionality in future updates. The share behavior was moved to the community section of the demo app. If your project relies on this behavior, please make the necessary adjustments to ensure compatibility: copy [the share behavior’s code](https://github.com/Instawork/hyperview/tree/b9d7ef251060f7722534a3caef36f5f83beec6b9/demo/src/Behaviors/Share) into your app, and make sure it’s registered [in the behavior prop](https://github.com/Instawork/hyperview/blob/b9d7ef251060f7722534a3caef36f5f83beec6b9/demo/App.tsx#L34) of the Hyperview component.


### Many Hyperview Demo Improvements
Our demo has received a significant overhaul to improve usability and showcase Hyperview's capabilities more effectively:

#### Fixes

First, Android functionality has been restored in the Expo app. A previous dependencies update had inadvertently cause a bug preventing the app to render its content properly, and this is now fixed. We made a few UI adjustment to fix improper spacing.
Finally we've removed exceptions in our XML validation - the demo app HXML code is now 100% compliant with the schema!

#### Community Components
We've invested time in adding some of the custom components we use at Instawork. We've added the [BottomTabBar](https://github.com/Instawork/hyperview/tree/b9d7ef251060f7722534a3caef36f5f83beec6b9/demo/src/Components/BottomTabBar) component, which showcases how to hook to the navigation layer while keeping control of the UI with HXML. We've also added our [Map/MapMarker](https://github.com/Instawork/hyperview/tree/b9d7ef251060f7722534a3caef36f5f83beec6b9/demo/src/Components/Map) components, and a couple other components demonstrating use of client side state and animations: [BottomSheet](https://github.com/Instawork/hyperview/tree/b9d7ef251060f7722534a3caef36f5f83beec6b9/demo/src/Components/BottomTabBar) and [ProgressBar](https://github.com/Instawork/hyperview/tree/b9d7ef251060f7722534a3caef36f5f83beec6b9/demo/src/Components/ProgressBar). All these components can be seen in action in [our live demo app](https://hyperview.org/docs/example_live).

### Welcoming New Contributors
We'd like to extend a warm welcome to our new contributors, [@uzyn](https://github.com/uzyn) and [@Shaykoo](https://github.com/Shaykoo), who have made their first contributions to Hyperview in this release. Thank you for your valuable input and for helping us make Hyperview even better!

### Full Changelog
For a detailed list of all changes and updates, please visit [our full changelog](https://github.com/Instawork/hyperview/releases/tag/v0.86.0).

We hope you enjoy the latest version of Hyperview and find these updates beneficial for your projects. As always, your feedback is invaluable to us, so feel free to share your thoughts and suggestions. Happy coding!
