---
id: reference_custom_behaviors
title: Custom behaviors
sidebar_label: Custom behaviors
---

The Hyperview client supports custom behaviors to trigger your own React Native code from user interactions. Unlike [custom elements](/docs/reference_custom_elements), custom behaviors extend the [behavior attribute syntax](/docs/reference_behavior_attributes) so that you can attach new behaviors to any existing element.

Custom behaviors have a limitation compared to first-class [behaviors](/docs/reference_behavior_attributes#action). The native behaviors in Hyperview are **two-way**: they can be triggered from the HXML, and then modify the HXML. Custom behaviors are only **one-way**: they can be triggered from the HXML, but the code that executes cannot modify the HXML.

Despite this limitation, custom behaviors are useful for integrations such as:

- event tracking and logging
- client-side state management libraries like Redux
- native APIs like phone calls, share sheets, message composers, etc.

Custom behaviors are registered with the `Hyperview` component via the `behaviors` prop.

| Property  | Type  | Required | Description                                              |
| --------- | ----- | -------- | -------------------------------------------------------- |
| behaviors | array | No       | Array of objects with "action" and "callback" properties |

Each registered behavior consists of two properties:

- `action`: The name of the action that will trigger the custom behaviors
- `callback`: The function to run when the behavior triggers. The callback takes one param: the [XML element](https://github.com/Instawork/hyperview/blob/master/src/types.js#L147) that triggers the behavior.

To trigger the custom behavior, use the registered action name as the `action` attribute in a `<behavior>` element. For example, if you registered an action with the name `foo`, you would trigger it like this:

```xml
<text>
  <behavior trigger="press" action="foo" />
  Test
</text>
```

Note that custom behaviors could be used with any `trigger` attribute. You can trigger custom behavior on load, long press, etc. You can also add extra namespaced attributes to the behavior attributes. These will get passed to the callback as part of the XML element:

```xml
<doc xmlns:foo="https://instawork.com/foo">
  <text>
    <behavior trigger="press" action="foo" foo:param1="bar" />
    Test
  </text>
</doc>
```

Below are some examples of custom behaviors used at Instawork to build our mobile apps:

## Event logging

If you have support for event tracking (via Amplitude or another service) available in your React Native code, you can specify when to log events with a custom behavior in HXML. Instawork uses Amplitude (hence the Amplitude naming conventions), but any logging system can be exposed in HXML using this technique.

To hook into Amplitude, pass a custom behavior to the `Hyperview` component:

```es6
import Amplitude from 'amplitude'; // your custom tracking library

const amplitudeBehavior = {
  action: 'amplitude',
  callback: (element: Element) => {
    const NAMESPACE_URI = 'https://instawork.com/hyperview-amplitude';
    const name = element.getAttributeNS(NAMESPACE_URI, 'event');
    if (name) {
      const propNode = element.getAttributeNodeNS(NAMESPACE_URI, 'event-props');
      const properties = propNode ? JSON.parse(propNode.value) : undefined;
      Amplitude.logEvent({ name, properties });
    }
  },
};

function Screen({ url }) {
  return (
    <Hyperview
      entrypointUrl={url}
      fetch={fetch}
      behaviors={[amplitudeBehavior]}
    />
  );
}
```

To use this custom behavior, add a `<behavior>` element with `action="amplitude"`. The attributes `amp:event` and `amp:event-props` specify the event name and event properties to log when the behavior executes.

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

If your app needs to allow the user to make phone calls, integrate the `react-native-communications` library and then add a custom behavior to trigger the system's phone caller.

```es6
import { phonecall } from 'react-native-communications';

const NAMESPACE_URI = 'https://instawork.com/hyperview-phone';

const phoneCallBehavior = {
  action: 'phone',
  callback: (element: Element) => {
    const number = element.getAttributeNS(NAMESPACE_URI, 'number');
    if (number) {
      phonecall(number);
    }
  },
};

function Screen({ url }) {
  return (
    <Hyperview
      entrypointUrl={url}
      fetch={fetch}
      behaviors={[phoneCallBehavior]}
    />
  );
}
```

To use this custom behavior, add a `<behavior>` element with `action="phone"`. The attributes `phone:number` specifies the number to call.

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

## Redux actions

If you're adding Hyperview to an existing React Native + Redux app, it can be useful to dispatch Redux actions from Hyperview screens. A custom behavior supports Redux action dispatch by adding a custom behavior to the `Hyperview` component.

#### Configuring the client

To hook into Redux, add a custom behavior that reads the `action` and `extra` attributes

```es6
import { dispatch } from './redux'; // instantiated redux store for the app
import type { Element } from 'hyperview';

const NAMESPACE_URI = 'https://instawork.com/hyperview-redux';

const reduxBehavior = {
  action: 'redux',
  callback: (element: Element) => {
    const reduxAction = element.getAttributeNS(NAMESPACE_URI, 'action');
    const extraNode = element.getAttributeNodeNS(NAMESPACE_URI, 'extra');
    if (reduxAction) {
      const extra = extraNode ? JSON.parse(extraNode.value) : null;
      dispatch({
        type: reduxAction,
        ...extra,
      });
    }
  },
};

function Screen({ url }) {
  return (
    <Hyperview entrypointUrl={url} fetch={fetch} behaviors={[reduxBehavior]} />
  );
}
```

To trigger a Redux action from HXML, add a `<behavior>` element with `action="redux"`. The attributes `redux:action` specifies the action type, and `redux:extra` contains an encoded JSON object of action prioerties.

```xml
<view xmlns:redux="https://instawork.com/hyperview-redux">
  <text>
    <behavior
      trigger="press"
      action="phone"
      redux:action="TOAST/SHOW_TOAST"
      redux:extra="{&quot;payload&quot;:{&quot;toast&quot;:{&quot;colorScheme&quot;:&quot;positive&quot;,&quot;message&quot;:&quot;Hello World!&quot;}}}"
    />
    Dispatch Redux
  </text>
</view>
```

The above example would dispatch a Redux action with type `TOAST/SHOW_TOAST` and extra properties `{'payload': {'toast': {'colorScheme': 'positive', 'message': 'Hello World!'}}}`. In the Instawork app, this action would trigger a temporary toast to slide down from the top of the screen.
