---
id: reference_spinner
title: <spinner>
sidebar_label: <spinner>
---

The `<spinner>` element shows a spinner to represent loading content.

```xml
<view style="spinnerContainer">
  <spinner color="#4778FF" />
</view>
```

## Structure

A `<spinner>` element can appear anywhere within a `<screen>` element.

## Attributes

- [`color`](#color)
- [`id`](#id)
- [`hide`](#hide)

#### `color`

| Type   | Required |
| ------ | -------- |
| string | No       |

A hexadecimal string indicating the color of the spinner.

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
