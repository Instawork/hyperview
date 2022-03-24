---
id: reference_doc
title: <doc>
sidebar_label: <doc>
---

The `<doc>` element represents the root of a Hyperview payload.

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

In the example above, the screen with id "main" will be displayed. The screen with id "preloadScreen" will not be rendered, but can be used to display subsequent screens or to serve as a loading state for subsequent screens.

## Structure

A `<doc>` element can only appear at the root of a Hyperview XML document. A doc can contain many `<screen>` elements, but only the first one will be rendered in the current screen. The other `<screen>` elements can be used to prefetch subsequent screens or indicators.

## Attributes

The `<doc>` does not take any attributes. It's good to set the default XML namespace on the doc so that it applies as the default to all of the children:

```xml
<doc xmlns="https://hyperview.org/hyperview">
```
