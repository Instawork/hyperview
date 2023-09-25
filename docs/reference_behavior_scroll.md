---
id: reference_behavior_scroll
title: Scrolling lists
sidebar_label: Scroll
---

Scrolling to a specific item in a list can be triggered via behaviors. The `scroll` action can be used in `<list>` and `<section-list>`. It is paired with a `target` attribute, that defines where the scroll position should be set to, and it accepts a couple optional attributes that help configuring the behavior.

Here's an example of a button that will cause a list to scroll back to the top, with an animation:

```xml
<list>
  <item id="top"><text>Item 1</text></item>
  <item><text>Item 1</text></item>
  <item><text>Item 1</text></item>
  ...
  <item>
    <text>Item 100</text>
    <view style="Button">
      <behavior
        xmlns:scroll="https://hyperview.org/hyperview-scroll"
        action="scroll"
        trigger="press"
        target="top"
        scroll:animated="true"
      />
      <text style="Button__Label">Scroll to top</text>
    </view>
  </item>
</list>
```

# Structure

Scroll behaviors are created using the standard [`<behavior>`](/docs/reference_behavior) element. To trigger a scroll behavior, just set the `action` attribute to `"scroll"`, and set a `target` to an element that exists and is nested under the list you're targetting.

NOTES:

- The behavior should also be defined as a nested child of the list.
- The `target` element can either be set with the `id` attribute value of an `<item>` element of the list, or a child element of an `<item>`. When the target is a child of an `<item>`, Hyperview will perform the scroll to the parent `<item>`. You can further refine the scroll position by using one of the configuring attributes (see below).

Attributes that configure the scroll behavior require their own namespace:

```html
https://hyperview.org/hyperview-scroll
```

It's usually convenient to define the XML namespace on the `<behavior>` element too:

```xml
<behavior
  xmlns:scroll="https://hyperview.org/hyperview-scroll"
  trigger="longPress"
  action="scroll"
  target="some-id"
/>
```

Note that any standard trigger can be used, as long as it's supported by the element containing the `<behavior>`.

The shared message and url are defined as namespaced attributes on the `<behavior>` element:

```xml
<behavior
  xmlns:scroll="https://hyperview.org/hyperview-scroll"
  trigger="longPress"
  action="scroll"
  target="some-id"
  scroll:animated="true"
  scroll:offset="100"
  scroll:position="0.5"
/>
```

## Scroll attributes

The following attributes are part of the `https://hyperview.org/hyperview-scroll` namespace.

### animated

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

This will condition whether the scrolling should be animated or not.

### offset

| Type    | Required |
| ------- | -------- |
| integer | **No**   |

A fixed number of pixels to offset the final target position.

### position

| Type                                | Required |
| ----------------------------------- | -------- |
| float between **0** (default) and 1 | **No**   |

A value of 0 places the item specified by index at the top, 1 at the bottom, and 0.5 centered in the middle.
