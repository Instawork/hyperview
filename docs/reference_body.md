---
id: reference_body
title: <body>
sidebar_label: <body>
---

The `<body>` element represents the body of the UI, meaning everything other than the header and bottom tab. The body can scroll or be of fixed size. Using flexbox styling, the body can represent a variety of top-level layouts. `<body>` elements can handle all of the standard behavior triggers, including "refresh" to provide a pull-to-refresh behavior.

Some examples of views:

```xml
<body id="Main" scroll="true">
  <view style="Section1">
    <text>First section in a vertically scrolling body</text>
  </view>

  <view style="Section 2">
    <text>Second section in a vertically scrolling body</text>
  </view>

  <view style="Section 3">
    <text>Third section in a vertically scrolling body</text>
  </view>

</body>
```

## Structure

A `<body>` element can only appear as a direct child of a `<screen>` element. There should only be one body per screen.

## Attributes

- [Behavior attributes](#behavior-attributes)
- [`safe-area`](#safe-area)
- [`style`](#style)
- [`scroll`](#scroll)
- [`scroll-orientation`](#scroll-orientation)
- [`shows-scroll-indicator`](#shows-scroll-indicator)
- [`id`](#id)

#### Behavior attributes

A `<body>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), including all triggers (press, refresh, visible, etc).

#### `safe-area`

| Type                         | Required |
| ---------------------------- | -------- |
| boolean, **false** (default) | No       |

If true, the body will be rendered in the safe area of the mobile device (avoiding notches at the top or bottom). Note that `safe-area` will only have an effect if `scroll` is false.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules will cannot be applied to a `<body>`.

#### `scroll`

| Type                      | Required |
| ------------------------- | -------- |
| true, **false** (default) | No       |

An attribute indicating whether the content in the can be scrollable. The style rules of the body will determine the viewport size.

#### `scroll-orientation`

| Type                               | Required |
| ---------------------------------- | -------- |
| **vertical** (default), horizontal | No       |

An attribute indicating the direction in which the body will scroll.

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
