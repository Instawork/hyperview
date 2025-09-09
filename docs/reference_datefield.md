---
id: reference_datefield
title: <date-field>
sidebar_label: <date-field>
---

The `<date-field>` element renders a date picker. The value of the `<date-field>` gets serialized as form data when a `<form>` gets submitted. Example:

```xml
<form>
  <date-field
    field-style="Input"
    field-text-style="Input__Text"
    label-format="MMMM D, YYYY"
    modal-style="PickerModal"
    modal-overlay-style="PickerModal__overlay"
    modal-text-style="PickerModal__text"
    placeholder="Select date"
    placeholderTextColor="#8D9494"
  />
</form>
```

## Structure

A `<date-field>` element can appear anywhere within a `<form>` element.

## Attributes

- [`name`](#name)
- [`label-format`](#label-format)
- [`mode`](#mode)
- [`value`](#value)
- [`placeholder`](#placeholder)
- [`min`](#min)
- [`max`](#max)
- [`field-style`](#field-style)
- [`field-text-style`](#field-text-style)
- [`modal-style`](#modal-style)
- [`modal-overlay-style`](#modal-overlay-style)
- [`modal-text-style`](#modal-text-style)
- [`id`](#id)
- [`hide`](#hide)
- [`allowFontScaling`](#allowFontScaling)
- [`maxFontSizeMultiplier`](#maxFontSizeMultiplier)
- [`minimumFontScale`](#minimumFontScale)

#### Behavior attributes

A `<date-field>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), including the following triggers:

- [blur](/docs/reference_behavior_attributes#blur)
- [change](/docs/reference_behavior_attributes#change)
- [focus](/docs/reference_behavior_attributes#focus)
- [submit](/docs/reference_behavior_attributes#submit)

#### `name`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

The name of the field within a `<form>` element. This name will be used when serializing a form to form data that gets sent in a server request.

#### `label-format`

| Type   | Required |
| ------ | -------- |
| string | Yes      |

Desired format of the date for the label. This uses the formatter function passed to the root hyperview component in your app via the `formatDate` prop. For example, if you're using [`moment`](https://momentjs.com/docs/#/displaying/), you could pass the following values: `MMMM D, YYYY`, `L`, etc.

#### `mode`

| Type   | Required                   |
| ------ | -------------------------- |
| string | No (defaults to `default`) |

Sets the date picker mode for Android only. Possible values are `calendar`, `spinner` and `default`.

#### `value`

| Type   | Required                      |
| ------ | ----------------------------- |
| string | No (defaults to current date) |

The value of the field in `YYYY-MM-DD` format.

#### `placeholder`

| Type   | Required |
| ------ | -------- |
| string | No       |

Shows a placeholder text in the date field when there is no selection.

#### `min`

| Type   | Required |
| ------ | -------- |
| string | No       |

Minimum value of the date allowed in selection in `YYYY-MM-DD` format.

#### `max`

| Type   | Required |
| ------ | -------- |
| string | No       |

Maximum value of the date allowed in selection in `YYYY-MM-DD` format.

#### `field-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the date field input. See [Styles](/docs/reference_style).

#### `field-text-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the date field input label. See [Styles](/docs/reference_style).

#### `modal-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the date selection modal on IOS (Android uses a [system style date picker](https://facebook.github.io/react-native/docs/datepickerandroid)). See [Styles](/docs/reference_style).

#### `modal-overlay-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the overlay on date selection modal for IOS (Android uses a [system style date picker](https://facebook.github.io/react-native/docs/datepickerandroid)). See [Styles](/docs/reference_style).

#### `modal-text-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the text on date selection modal for IOS (Android uses a [system style date picker](https://facebook.github.io/react-native/docs/datepickerandroid)). See [Styles](/docs/reference_style).

#### `modal-animation-duration`

| Type   | Required |
| ------ | -------- |
| number | No       |

The duration in milliseconds that the open and close animation (including the fading animation of the overlay) of the date selection modal for IOS takes. Defaults to 250ms.

#### `modal-overlay-animation-duration`

| Type   | Required |
| ------ | -------- |
| number | No       |

The duration in milliseconds that the open and close animation of the date selection modal overlay for IOS takes. Defaults to value of `modal-animation-duration`.

#### `modal-dismiss-animation-duration`

| Type   | Required |
| ------ | -------- |
| number | No       |

The duration in milliseconds that the close animation of the date selection modal for IOS takes. Defaults to value of `modal-animation-duration`.

#### `modal-dimiss-overlay-animation-duration`

| Type   | Required |
| ------ | -------- |
| number | No       |

The duration in milliseconds that the close animation of the date selection modal overlay for IOS takes. Defaults to value of `modal-overlay-animation-duration`.

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

#### `allowFontScaling`

| Type    | Required |
| ------- | -------- |
| boolean | No       |

Specifies whether fonts should scale to respect Text Size accessibility setting

#### `maxFontSizeMultiplier`

| Type   | Required |
| ------ | -------- |
| number | No       |

Specifies whether fonts should scale to respect Text Size accessibility setting

#### `minimumFontScale` (iOS)

| Type   | Required |
| ------ | -------- |
| number | No       |

Specifies the smallest possible scale a font can reach when adjustsFontSizeToFit is enabled. (values 0.01-1.0).
