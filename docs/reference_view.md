---
id: reference_view
title: <view>
sidebar_label: <view>
---

The `<view>` element is a basic building block for UI layouts. Using flexbox styling, nested views can create sophisticated components that can scale and adapt to different screen sizes. Views can also serve as a viewport onto scrolling content.

Some examples of views:

```xml
<body>
  <view style="FlexHorizontal">
    <text>Basic view</text>
    <text>With Horizontal Layout</text>
  </view>

  <view style="FlexVertical">
    <text>Basic view</text>
    <text>With Vertical Layout</text>
  </view>

  <view
    style="Short FlexHorizontal"
    scroll="true"
    scroll-orientation="horizontal"
  >
    <text>This</text>
    <text>view</text>
    <text>will</text>
    <text>scroll</text>
    <text>horizontally</text>
  </view>

  <view style="Short FlexVertical" scroll="true" scroll-orientation="vertical">
    <text>This</text>
    <text>view</text>
    <text>will</text>
    <text>scroll</text>
    <text>vertically</text>
  </view>

</body>
```

## Structure

A `<view>` element can only appear anywhere within a `<screen>` element.

## Attributes

- [Behavior attributes](#behavior-attributes)
- [`safe-area`](#safe-area)
- [`style`](#style)
- [`scroll`](#scroll)
- [`scroll-orientation`](#scroll-orientation)
- [`scroll-to-input-offset`](#scroll-to-input-offset)
- [`shows-scroll-indicator`](#shows-scroll-indicator)
- [`id`](#id)
- [`hide`](#hide)
- [`avoid-keyboard`](#avoid-keyboard)

#### Behavior attributes

A `<view>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), including all triggers (press, refresh, visible, etc).

#### `safe-area`

| Type                         | Required |
| ---------------------------- | -------- |
| boolean, **false** (default) | No       |

If true, the body will be rendered in the safe area of the mobile device (avoiding notches at the top or bottom). Note that `safe-area` will only have an effect if `scroll` is false.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to a `<view>`.

#### `scroll`

| Type                      | Required |
| ------------------------- | -------- |
| true, **false** (default) | No       |

An attribute indicating whether the content in the can be scrollable. The style rules of the view will determine the viewport size.

#### `scroll-orientation`

| Type                               | Required |
| ---------------------------------- | -------- |
| **vertical** (default), horizontal | No       |

An attribute indicating the direction in which the view will scroll.

#### `scroll-to-input-offset`

| Type   | Required                |
| ------ | ----------------------- |
| number | No (defauls to **120**) |

An attribute defining an additional scroll offset to be applied to the view, when a `<text-field>` or `<text-area>` is focused. Only valid in combination with attribute `scroll` set to `"true"`.

#### `shows-scroll-indicator`

| Type                      | Required |
| ------------------------- | -------- |
| **true** (default), false | No       |

An attribute indicating whether the scroll bar should be shown. Attribute `scroll` should be set in for this to have any effect.

#### `id`

| Type   | Required |
| ------ | -------- |
| string | No       |

A global attribute uniquely identifying the element in the whole document.

#### `hide`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

If `hide="true"`, the element will not be rendered on screen. If the element or any of the element's children have a behavior that triggers on "load" or "visible", those behaviors will not trigger while the element is hidden.

#### `avoid-keyboard`

| Type                      | Required |
| ------------------------- | -------- |
| true, **false** (default) | No       |

An attribute to solve the common problem of views that need to move out of the way of the virtual keyboard. It can automatically adjust the position of its children based on the keyboard height. This is useful when you want keyboard avoiding behavior in non-scrollable views. It is applied only in iOS since Android has built-in support for avoiding keyboard.

#### `sticky`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

If `sticky="true"`, the element will remain fixed at the top of the screen when scrolling. This should be used in conjunction with an immediate parent view with `scroll="true"` and `scroll-orientation="vertical"`.
