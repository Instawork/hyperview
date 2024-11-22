---
id: reference_loading_screens
title: Loading Screens
sidebar_label: Loading Screens
---

The Hyperview client supports displaying loading screens during fetch requests. Examples of these loading screen options are available in the included demo application.

## default component

If no custom component is provided, a default internal component will be used. This component is a simple white screen with a centered gray spinning graphic.

## loadingScreen

The `<Hyperview>` component provides an optional `loadingScreen` property. When a component is provided to this property, the custom component will always be used instead of the default component.

```es6
import { ActivityIndicator, View } from 'react-native';
import React from 'react';

const DefaultLoadingScreen = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator color={'#8d9494'} size="large" />
    </View>
  );
};
```

```es6
<Hyperview
  ...
  loadingScreen={DefaultLoadingScreen}
/>
```

## loadingScreens

In addition to supporting a single custom loading screen, Hyperview provides support for passing named loadingScreen components. These named screens can be invoked by id in the codebase.

```es6
<Hyperview
  ...
  loadingScreens={{
    'green-loader': GreenLoadingScreen,
  }}
/>
```

Once these have been passed in, they can be referenced via the `show-during-load` attribute of navigation behaviors.

```es6
<behavior
  action="new"
  href="/hyperview/public/navigation/behaviors/actions/modal/index.xml"
  show-during-load="green-loader"
/>
```
