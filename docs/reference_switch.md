---
id: reference_switch
title: <switch>
sidebar_label: <switch>
---

The `<switch>` element represents a boolean input field. When pressed, the switch toggles values between "on" and "off". The value of the `<switch>` get serialized as form data when a `<form>` gets submitted.

![selected](/img/reference_switch.png)

```xml
<form>
  <switch name="notifications" value="on" />
</form>
```

## Structure

A `<switch>` element can appear anywhere within a `<form>` element.

## Attributes

- [Structure](#structure)
- [Attributes](#attributes)
  - [Behavior attributes](#behavior-attributes)
  - [`name`](#name)
  - [`value`](#value)
  - [`style`](#style)
  - [`id`](#id)
  - [`hide`](#hide)

#### Behavior attributes

A `<switch>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), with [change](/docs/reference_behavior_attributes#change) trigger.

#### `name`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

The name of the field within a `<form>` element. This name will be used when serializing a form to form data that gets sent in a server request.

#### `value`

| Type        | Required               |
| ----------- | ---------------------- |
| "on", "off" | No (defaults to "off") |

The value of the field. A value of "on" corresponds to a switch that is on.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that the only style that will be applied to the switch is `color` and `backgroundColor`. The color will be applied to the thumb of the switch (the part that moves between on/off). The background color will be applied to the track of the switch.

`<switch>` supports the `selected` style modifier. See [Modifiers](/docs/reference_modifier) for more details. The `backgroundColor` and `color` in the `selected` modifier will be applied when the switch is on.

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
