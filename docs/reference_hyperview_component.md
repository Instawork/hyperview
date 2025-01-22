---
id: reference_hyperview_component
title: Hyperview component
sidebar_label: Hyperview component
---

The `hyperview` npm module exports the `Hyperview` React Native component. `Hyperview` takes props to load a particular URL (with an HXML response).

Here's a minimal example to render one screen:

```es6
import Hyperview from 'hyperview';

function Screen({ url }) {
  return <Hyperview entrypointUrl={url} fetch={fetch} />;
}
```

- `entrypointUrl` is the URL for the screen. `Hyperview` will make a `GET` request to fetch the URL. The response should be an HXML doc, that will be parsed and rendered on-screen.
- `fetch` is the fetch method used to make requests in the screen. Since it is injected, the app can modify the method. This is commonly done to add headers for authentication, like an API header or cookie.

To see more examples of `Hyperview` features, check out the [demo app code](https://github.com/Instawork/hyperview/blob/master/demo/screens/HyperviewScreen.js#L70).
