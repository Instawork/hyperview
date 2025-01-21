---
id: reference_loading_screen
title: Loading Screen
sidebar_label: Loading Screen
---

The Hyperview client supports passing a loading screen component in via the `loadingScreen` prop. This loading screen can be customized to suit your application's design needs. It will be displayed by Hyperview any time content is being retrieved via network request\*.

The `loadingScreen` prop takes a component which accepts an optional `element` property and returns a JSX.Element.

```es6
import { ActivityIndicator, View } from 'react-native';

const LoadingScreen = (props: { element?: Element }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator />
    </View>
  );
};

<Hyperview
  entrypointUrl="http://myapp.com/index.xml"
  fetch={fetchWrapper}
  formatDate={formatDate}
  loadingScreen={LoadingScreen}
/>;
```

The optional element which is passed into the loading screen provides a way to modify the appearance or functionality based on the XML structure which triggered the load. When loading is triggered via a navigation action, the `<behavior>` element is passed into the loading screen. When loading is triggered by a `<nav-route>` element, the `nav-route` is passed into the loading screen.

### Example

The following example shows how to use the `id` attribute of the `<behavior>` element to colorize the load indicator.

```xml
<view>
  <behavior id="green-loader" action="new" href="/example.xml">
</view>
```

```es6
import { ActivityIndicator, View } from 'react-native';

const LoadingScreen = (props: Props) => {
  const id = props.element?.getAttribute('id');
  const color = id === 'green-loader' ? 'green' : defaultColor;
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        gap: 10,
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator color={color} />
    </View>
  );
};
```

\* Hyperview behaviors also support rendering a `<screen>` element during loading by adding a `show-during-load` attribute in navigation behaviors. See [show-during-load](/docs/reference_behavior_attributes#navigation-actions-1) for more information.

See [actions](/docs/reference_behavior_attributes#actions) for more information on behavior actions.

See [nav-route](/docs/reference_nav_route) for more information on nav routes.
