---
id: reference_section
title: <section>
sidebar_label: <section>
---

---

**NOTE**
[Deprecated]
`<section>` is no longer required; `<section-title>` and `<item>` elements may now be direct children of `<section-list>`.

---

The `<section>` element represents a group of items in a `<section-list>`. A section contains a title and items. The section itself does not have any visible style, it just serves as a grouping within the section list.

```xml
<section-list style="List">
  <section>
    <section-title style="Header">
      <text>Section 1</text>
    </section-title>

    <item key="a" style="Item">
      <text>Item 1</text>
    </item>
  </section>

  <section>
    <section-title style="Header">
      <text>Section 1</text>
    </section-title>

    <item key="b" style="Item">
      <text>Section 2</text>
    </item>
  </section>
</section-list>
```

## Structure

A `<section>` element will only render `<section-title>`, `<item>` and `<items>` children elements. Other elements will be ignored during rendering.

A `<section>` element can only appear as a direct child of a `<section-list>` element. It will not render on the screen in other contexts.

## Attributes

- [`id`](#id)
- [`hide`](#hide)

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
