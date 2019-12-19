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
- [`modal-text-style`](#modal-text-style)
- [`id`](#id)
- [`hide`](#hide)

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

#### `modal-text-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the text on date selection modal for IOS (Android uses a [system style date picker](https://facebook.github.io/react-native/docs/datepickerandroid)). See [Styles](/docs/reference_style).

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
