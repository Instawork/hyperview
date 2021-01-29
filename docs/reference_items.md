---
id: reference_items
title: <items>
sidebar_label: <items>
---

The `<items>` element represents a group of items in a list. This group does not have a visual representation, it only allows multiple items to be added to a list (via `append` or `prepend`, or `replace-inner` actions).

```xml
<list style="MyList">
  <item key="a">
    <text>Item A</text>
  </item>

  <items>
    <item key="b">
      <text>Item B</text>
    </item>

    <item key="c">
      <text>Item C</text>
    </item>
  </items>
</list>
```

## Structure

An `<items>` element will only render `<item>` children elements. Other elements will be ignored during rendering.

An `<items>` element only appears as a direct child of a `<list>` and `<section>`.

## Attributes

The `<items>` element has no attributes.
