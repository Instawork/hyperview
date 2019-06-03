---
id: reference_pickerfield
title: <picker-field>
sidebar_label: <picker-field>
---

The `<picker-field>` element represents a single-line input field. When pressed, the field focused and a modal appears, allowing the user to select one of the available options. The modal uses a platform-specific widget:

- on Android, it shows the system picker modal
- on iOS, the spinner-picker appears at the bottom of the screen

A picker field with no value selected:
![unselected](/img/reference_pickerfield_unselected.png)

On iOS, pressing the field brings up a bottom sheet modal with a picker
![focused](/img/reference_pickerfield_focused.png)

After selecting a value and pressing "Done", the field has the value selected.
![focused](/img/reference_pickerfield_selected.png)

Like other input elements, the selected value of the picker gets serialized by the parent form when making requests to the server.

```xml
<picker-field field-style="Input"
              field-text-style="Input__Text"
              placeholder="Select choice">
  <picker-item label="Choice 0"
               value="0" />
  <picker-item label="Choice 1"
               value="1" />
  <picker-item label="Choice 2"
               value="2" />
  <picker-item label="Choice 3"
               value="3" />
</picker-field>
```

## Structure

A `<picker-field`> element can appear anywhere within a `<form>` element. Its children must only be `<picker-item>` elements.

## Attributes

- [`name`](#name)
- [`value`](#value)
- [`placeholder`](#placeholder)
- [`done-label`](#done-label)
- [`cancel-label`](#cancel-label)
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

The name of the picker field within a `<form>` element. This name will be used when serializing a form to form data that gets sent in a server request.

#### `value`

| Type   | Required               |
| ------ | ---------------------- |
| string | No (defaults to blank) |

The value of the picker field. This string gets rendered into the string and can be edited by the user. Set this value in the XML to pre-populate the picker field.

#### `placeholder`

| Type   | Required |
| ------ | -------- |
| string | No       |

A label that appears within the picker field. The placeholder only appears when the field is empty.

#### `done-label`

| Type   | Required |
| ------ | -------- |
| string | No       |

This label appears in the button of the iOS modal. Pressing the button will apply the selected value to the field. Defaults to "Done".

#### `cancel-label`

| Type   | Required |
| ------ | -------- |
| string | No       |

This label appears in the button of the iOS modal. Pressing the button will ignore the selected value, and the value in the picker field will remain unchanged.

#### `field-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the picker field container. This is the visual element that surrounds the selected picker value. You can use these styles to define borders, margin, and padding around the picker field. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to the container.

#### `field-text-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the text value of the picker field. Use these styles to define the font size, color, and weight of the value in the picker field. See [Styles](/docs/reference_style). Note that only text style rules can be applied to the text.

#### `modal-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the iOS bottom-sheet modal. You can use these styles to define borders, margin, and padding around the bottom modal that appears on iOS. On Android, the system defines the look of the modal, so these styles will not be applied. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to the modal.

#### `modal-text-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the buttons in the iOS bottom-sheet modal. You can use these styles to define the size, color, and weight of the buttons in the iOS modal. On Android, the system defines the look of the modal, so these styles will not be applied. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to the modal.

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
