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

  <view style="Short FlexHorizontal" scroll="true" scroll-orientation="horizontal">
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
- [`style`](#style)
- [`scroll`](#scroll)
- [`scroll-orientation`](#scroll-orientation)
- [`scroll-to-input-offset`](#scroll-to-input-offset)
- [`id`](#id)
- [`hide`](#hide)

#### Behavior attributes

A `<view>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), including all triggers (press, refresh, visible, etc).

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
