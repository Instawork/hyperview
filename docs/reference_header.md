---
id: reference_header
title: <header>
sidebar_label: <header>
---

The `<header>` element represents the header of a screen in the app. Typically, the header shows a title and navigation elements

An example header on a screen with a scrolling body.

```xml
<screen>
  <header style="MyHeader">
    <text href="#">Back</text>
    <text>My App</text>
  </header>
  <body style="Flex" scroll="true">
    <view style="FlexHorizontal">
      <text>Basic view</text>
      <text>With Horizontal Layout</text>
    </view>
  </body>
</screen>
```

## Structure

A `<header>` element can only appear as a direct child of a `<screen>` element.

## Attributes

- [Behavior attributes](#behavior-attributes)
- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)

#### Behavior attributes

A `<header>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), except for the "refresh" trigger.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules will cannot be applied to a `<header>`.

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
