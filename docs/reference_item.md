---
id: reference_item
title: <item>
sidebar_label: <item>
---

The `<item>` element represents an item in a `<list>` or `<section-list>`. The structure and attributes of an `<item>` match the `<view>` element.

Here's a single item in a list:

```xml
<list style="List">
  <item key="a" style="Item">
    <view style="Left">
      <image source="avatar.png" style="Avatar">
    </view>
    <view style="Right">
      <text>Line 1</text>
      <text>Line 2</text>
    </view>
  </item>
</list>
```

Here's a single item in a section list:

```xml
<section-list style="List">
  <section-title style="Header">
    <text>Section 1</text>
  </section-title>

  <item key="a" style="Item">
    <view style="Left">
      <image source="avatar.png" style="Avatar">
    </view>
    <view style="Right">
      <text>Line 1</text>
      <text>Line 2</text>
    </view>
  </item>
</section-list>
```

Note that the `key` attribute is required and must be unique among items in the parent list.

## Structure

An `<item>` element can only apear as a direct child of a `<list>` or `<section-list>` element. It can contain any non-list element as a child.

## Attributes

- [Behavior attributes](#behavior-attributes)
- [`key`](#key)
- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)
- [`sticky`](#sticky)

#### Behavior attributes

An `<item>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes). However, since `<item>` elements can only be children of scrollable `<list>` elements, the pull-to-refresh gesture will never trigger on an `<item>`. Thus, `refresh` triggers should only be added to the parent list element.

#### `key`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

A unique key identifying the item in the list. This key is used to efficiently update the list when items are added or removed.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style).

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

#### `sticky`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

Makes the item "sticky" at the top of the list when scrolling, until another item with the sticky attribute replaces it.

**NOTE:** This attribute is only observed for `<item>` element rendered within a `<list>` element. `<section-list>` element has its own mechanism for sticky section headers, hence does not support setting individual items as sticky.
