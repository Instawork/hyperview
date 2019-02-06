---
id: reference_hyperview_component
title: Hyperview component
sidebar_label: Hyperview component
---

The `hyperview` npm module exports the `Hyperview` React Native component. `Hyperview` takes props to load a particular URL (with an HXML response).

Here's a minimal example to render one screen:

```es6
import Hyperview from 'hyperview';

function screen({ url }) => (
  <Hyperview
    entrypointUrl={url}
    fetch={fetch}
  />
);
```

- `entrypointUrl` is the URL for the screen. `Hyperview` will make a `GET` request to fetch the URL. The response should be an HXML doc, that will be parsed and rendered on-screen.
- `fetch` is the fetch method used to make requests in the screen. Since it is injected, the app can modify the method. This is commonly done to add headers for authentication, like an API header or cookie.

To support navigation between Hyperview screens, navigation methods (connected to `react-navigation`) need to be supplied to the component as well:

```es6
import Hyperview from 'hyperview';

export default class Screen extends PureComponent<Props> {
  push() {
    // code to push a new screen on stack rendering Screen
  }

  back() {
    // code to pop this screen off the stack
  }

  closeModal() {
    // code to close the current modal
  }

  openModal() {
    // code to open a new screen in a modal
  }

  navigate() {
    // code to navigate to a given screen in the stack
  }

  render() {
    return (
      <Hyperview
        entrypointUrl={url}
        fetch={fetch}
        back={this.back}
        closeModal={this.closeModal}
        openModal={this.openModal}
        navigate={this.navigate}
        push={this.push}
      />
    );
  }
);
```

To see how a `Hyperview` screen can be connected to navigation, check out the [demo app code](https://github.com/Instawork/hyperview/blob/master/demo/screens/HyperviewScreen.js#L70).
