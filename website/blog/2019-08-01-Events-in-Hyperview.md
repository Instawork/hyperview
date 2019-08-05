---
author: Divyanshu Maithani
authorURL: https://twitter.com/divyanshu013
title: Events in Hyperview
---

We recently added an **elements management system** with **events** in Hyperview [PR #81](https://github.com/Instawork/hyperview/pull/81). This makes it easier to communicate between different Hyperview screens. Thanks to [adamstep](https://github.com/adamstep) and [flochtililoch](https://github.com/flochtililoch) for valuable feedback and coming up with the API design.

## Problem

Quite often a change in one screen can result in a change in an existing screen in the navigation stack. For example, consider a screen containing user feeds. Clicking on a post in the feeds screen opens a new screen which displays the post. Clicking on "like" should also update the like count in the previous screen which is already pushed on the navigation stack. This is a good use case for using the **elements management system**.

## Spec

This feature introduces a **new trigger** [`on-event`](/docs/reference_behavior_attributes#on-event) and a **new behavior action** [`dispatch-event`](/docs/reference_behavior_attributes#dispatch-event). (Refer to the [example](https://github.com/Instawork/hyperview/tree/master/examples/advanced_behaviors/dispatch_event) for complete XML)

## Usage

Consider the following view from `dispatch_event.xml` rendered on the screen:

```html
<view action="append" trigger="on-event" event-name="test-event" scroll="true" href="/advanced_behaviors/dispatch_event/dispatch_event_append.xml" style="Main">
  <text style="Description">Dispatch events to load screens</text>
  <view style="Button" href="/advanced_behaviors/dispatch_event/dispatch_event_source.xml">
  <text style="Button__Label">Open new screen</text>
</view>
```

This view will listen for `on-event` trigger **specifically** for the `event-name` `test-event`. When this event is caught, it does the `append` action and appends the XML fragment `dispatch_event_append.xml` which looks like:

```html
<text xmlns="https://hyperview.org/hyperview">This will get appended with events!</text>
```

The source of this event is a different screen:

```html
<view style="Button">
  <behavior trigger="press" action="dispatch-event" event-name="test-event" />
  <text style="Button__Label">Reload previous</text>
</view>
```

With the `press` trigger the `dispatch-event` action will fire an event *(internal to hyperview)* with the name defined by the `event-name` attribute.

## Extending

`on-event` and `dispatch-event` also supports [`once`](/docs/reference_behavior_attributes#once) and [`delay`](/docs/reference_behavior_attributes#delay).

### Extending with `once`

- When added to a **listener behavior** (with `trigger="on-event"`), the behavior would only respond to the dispatched event once (till the screen is unmounted)
- When added to the **dispatching behavior** (with `action="dispatch-event"`), the behavior will only dispatch the event once

### Extending with `delay`

- When added to a **listener behavior** (with `trigger="on-event"`), the behavior would respond to the dispatched event after the specified delay (in milliseconds)
- When added to the **dispatching behavior** (with `action="dispatch-event"`), the behavior will dispatch the event after the specified delay (in milliseconds)

## Examples

Some more examples where events fit in are:

1. When actions on one screen might affect another screen, for example interacting with an element might update some element in another screen which is beneath the current screen in the navigation stack.

2. Events can help in **decoupling UI elements**. A dispatching element doesn't need to know about the receiver element (for example target id). This way, UI elements can be responsive (keep their behaviors nested under the element, rather than in a different place).

## Debugging tip

In `__DEV__` mode, the console will log the element which captures an event as well as the element which dispatches it.

Please check the behavior attributes [docs](/docs/reference_behavior_attributes) for more info.
