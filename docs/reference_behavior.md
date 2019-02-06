---
id: reference_behavior
title: <behavior>
sidebar_label: <behavior>
---

The `<behavior>` element allows adding multiple behaviors to UI elements such as `<view>`, `<text>`, `<image>`, etc.

```xml
<view style="Button">
  <behavior trigger="press" href="/display" />
  <behavior trigger="longPress" href="/edit" target="new" />
  <text style="Button__Label">Item</text>
</view>
```

The example above shows a button with two behaviors:

- When the button is pressed, we request "/display" and push the content as a new screen.
- When the button is long-pressed, we request "/edit" and show the content as a modal.

`<behavior>` elements can be mixed with behavior attributes on the parent element. The example below works the same as the one above.

```xml
<view style="Button" trigger="press" href="/display">
  <behavior trigger="longPress" href="/edit" target="new" />
  <text style="Button__Label">Item</text>
</view>
```

## Structure

A `<behavior>` element defines a behavior that applies to its direct parent element. The following elements can contain `<behavior>` elements as a direct child:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)
- [`<list>`](/docs/reference_list)
- [`<section-list>`](/docs/reference_sectionlist)
- [`<option>`](/docs/reference_option)

## Attributes

- [Behavior attributes](#behavior-attributes)

#### Behavior attributes

A `<behavior>` element accepts the standard [behavior attributes](behaviors). The supported triggers depend on the parent element.
