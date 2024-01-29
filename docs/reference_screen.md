---
id: reference_screen
title: <screen>
sidebar_label: <screen>
---

The `<screen>` element represents the UI that gets rendered on a single screen of a mobile app.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <styles />
    <body />
  </screen>

  <screen id="preloadScreen">
    <styles />
    <body />
  </screen>
</doc>
```

The example above contains two screens in a Hyperview doc. The first `<screen>` will be rendered on the device. The second `<screen>` can be used as a temporary indicator screen while a subsequent screen loads.

## Structure

A `<screen>` element can only appear as a direct child of a `<doc>` element.

## Attributes

- [`id`](#id)

#### `id`

| Type   | Required |
| ------ | -------- |
| string | No       |

A global attribute uniquely identifying the element in the whole document.
