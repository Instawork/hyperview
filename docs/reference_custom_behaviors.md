---
id: reference_custom_behaviors
title: "Custom behaviors"
sidebar_label: "Custom behaviors"
---

> **NOTE**: custom behaviors are still under active development. The architecture will be changing in the near future to add more flexibility.

The Hyperview client currently supports a limited number of custom behaviors for deeper integrations with mobile app functionality. These custom behaviors are configured by passing callback props to the `Hyperview` component.

## Event logging
If you have support for event tracking (via Amplitude or another service) available in your React Native code, you can specify when to log events with a custom behavior in HXML. Instawork uses Amplitude (hence the Amplitude naming conventions), but any logging system can be exposed in HXML using this technique.

#### Configuring the client
To hook into Amplitude, add a `logEvent` callback prop to the `Hyperview` component:

```es6
import Amplitude from 'amplitude'; // your custom tracking library

function screen({ url }) => (
  <Hyperview
    entrypointUrl={url}
    fetch={fetch}
    logEvent={({ name, properties }) => Amplitude.track(name, properties); }
  />
)
```

The `logEvent`  callback takes a dictionary with two properties:

| Property    | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
|  name       | string   | Yes      | The name of the event to log. |
|  properties | object   | No       | Object containing key/value event properties. |

Note that the `logEvent` callback can attach to any logging service, but at Instawork we use Amplitude. 

#### Using in HXML
Add a `<behavior>` element with `action="amplitude"`. The attributes `amp:event` and `amp:event-props` specify the event name and event properties to log when the behavior executes.

```xml
<view xmlns:amp="https://instawork.com/hyperview-amplitude">
  <behavior
    trigger="load"
    action="amplitude"
    amp:event="main-screen/view"
  />

  <text>
    <behavior
      trigger="press"
      action="amplitude"
      amp:event="main-screen/next/press"
      amp:event-props="{&quot;id&quot;:123}"
    />
    Next
  </text>
</view>
```

In this example, we log `main-screen/view` to Amplitude when the view loads. When the user presses the "Next" button, we log `main-screen/next/press` with the event props `id = 123`.

Note that amplitude behaviors require that the HXML doc define a namespace for `https://instawork.com/hyperview-amplitude`.

## Phone calls
HXML behaviors can trigger calling or sending an SMS to a given phone number via a callback passed to the `Hyperview` component.

#### Configuring the client
To hook into calling functionality, add an `onCall` callback prop to the `Hyperview` component:

```es6
import { phonecall } from 'react-native-communications';

function screen({ url }) => (
  <Hyperview
    entrypointUrl={url}
    fetch={fetch}
    onCall={(num) => phonecall(num, false); }
  />
)
```

The `onCall` prop takes a function with one parameter:

| Parameter   | Type     | Required | Description |
| ----------- | -------- | -------- | ----------- |
|  num        | string   | Yes      | The phone number to call. |

Note that the `onCall` callback can trigger any sort of UI or call capability implemented in React Native.

#### Using in HXML
Add a `<behavior>` element with `action="phone"`. The attributes `phone:number` specifies the number to call.

```xml
<view xmlns:phone="https://instawork.com/hyperview-phone">
  <text>
    <behavior
      trigger="press"
      action="phone"
      phone:number="5554443214"
    />
    Call (555) 444-3214
  </text>
</view>
```

The above example would show a UI to confirm the call to the given number.


## Share sheet
Share buttons are common in mobile apps. To hook into the mobile device's native sharing functionality, you can use the custom share behavior.

#### Configuring the client
To hook into the system's share functionality, add an `onShare` callback prop to the `Hyperview` component:

```es6
import { Share } from 'react-native';

function screen({ url }) => (
  <Hyperview
    entrypointUrl={url}
    fetch={fetch}
    onShare={Share.share}
  />
)
```

#### Using in HXML
Add a `<behavior>` element with `action="share"`. The attributes `share:dialog-title`, `share:message`, `share:subject`, and `share:url` cnofigure the share dialog. `share:message` and `share:url` are the required attributes.

```xml
<view xmlns:share="https://instawork.com/hyperview-share">
  <text>
    <behavior
      trigger="press"
      action="share"
      share:dialog-title="Share achievement!"
      share:message="Share your achievement with friends"
      share:subject="I just unlocked the Pro achievement."
      share:url="https://badges.com/achievements/123"
    />
    Share achievement
  </text>
</view>
```

The above example would trigger the system share dialog with options to share the title/message/subject/url on a social platform of choice.


## Redux actions
If you're adding Hyperview to an existing React Native + Redux app, it can be useful to dispatch Redux actions from Hyperview screens. A custom behavior supports Redux action dispatch by adding a callback to the `Hyperview` components.

#### Configuring the client
To hook into Redux, add a `dispatchReduxAction` callback prop to the `Hyperview` component:

```es6
import { store } from './redux'; // instantiated redux store for the app

function screen({ url }) => (
  <Hyperview
    entrypointUrl={url}
    fetch={fetch}
    dispatchReduxAction={store.dispatch}
  />
)
```

The `dispatchReduxAction` prop takes a function with one parameter, the Redux action. Reduct actions must contains a `type` property, and can optionally contain additional properties to customize the action.

#### Using in HXML
Add a `<behavior>` element with `action="redux"`. The attributes `redux:action` specifies the action type, and `redux:extra` contains an encoded JSON object of action prioerties.

```xml
<view xmlns:redux="https://instawork.com/hyperview-redux">
  <text>
    <behavior
      trigger="press"
      action="phone"
      redux:action="TOAST/SHOW_TOAST"
      redux:extra="{&quot;payload&quot;:{&quot;toast&quot;:{&quot;colorScheme&quot;:&quot;positive&quot;,&quot;message&quot;:&quot;Hello World!&quot;}}}"
    />
    Dispatch Reduz
  </text>
</view>
```

The above example would dispatch a Redux action with type `TOAST/SHOW_TOAST` and extra properties `{'payload': {'toast': {'colorScheme': 'positive', 'message': 'Hello World!'}}}`. In the Instawork app, this action would trigger a temporary toast to slide down from the top of the screen.
