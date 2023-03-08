---
id: reference_sectiontitle
title: <section-title>
sidebar_label: <section-title>
---

The `<section-title>` element represents the title of a group of `<item>` within a `<section-list>`. It renders as an optionally sticky element that stays at the top of the list while the user scrolls through items in that section.

```xml
<section-list style="List">
  <!-- Section 1 -->
  <section-title style="Header">
    <text>Section 1</text>
  </section-title>

  <item key="a" style="Item">
    <text>Item 1</text>
  </item>

  <!-- Section 2 -->
  <section-title style="Header">
    <text>Section 1</text>
  </section-title>

  <item key="b" style="Item">
    <text>Section 2</text>
  </item>
</section-list>
```

## Structure

A `<section-title>` element can only appear as a direct child of a `<section-list>` or `<items>` element.

## Attributes

- [Behavior attributes](#behavior-attributes)
- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)

#### Behavior attributes

A `<section-title>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes). However, since `<section-title>` elements can only be children of scrollable `<section-list>` elements, the pull-to-refresh gesture will never trigger on a `<section-title>`. Thus, `refresh` triggers should only be added to the parent section list element.

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
