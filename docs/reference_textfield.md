---
id: reference_textfield
title: "<text-field>"
sidebar_label: "<text-field>"
---

The `<text-field>` element represents a single-line input field. When pressed, the field focuses and a keyboard appears to accept user input. The value entered into the `<text-field>` get serialized as form data when a `<form>` gets submitted.

```xml
<form>
  <text-field
    name="name"
    placeholder="Your name"
    value="Bart"
  />
  <text-field
    name="phone"
    placeholder="Your phone number"
    mask="(999) 999-9999"
    keyboard-type="phone-pad"
  />
</form>
```

## Structure
A `<text-field>` element can appear anywhere within a `<form>` element.

## Attributes
* [`name`](#name)
* [`value`](#value)
* [`placeholder`](#placeholder)
* [`keyboard-type`](#keyboard-type)
* [`mask`](#mask)
* [`style`](#style)
* [`id`](#id)
* [`hide`](#hide)

#### `name`
| Type     | Required |
| -------- | -------- |
| string   | **Yes**  |

The name of the field within a `<form>` element. This name will be used when serializing a form to form data that gets sent in a server request.

#### `value`
| Type     | Required |
| -------- | -------- |
| string   | No (defaults to blank) |

The value of the field. This string gets rendered into the string and can be edited by the user. Set this value in the XML to pre-populate the text field.

#### `placeholder`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A label that appears within the text field. The placeholder only appears when the field is empty.

#### `keyboard-type`
| Type     | Required |
| -------- | -------- |
| string   | No (defaults to **default**) |

Sets the type of keybaord to show when the user focuses the input. Supported options:
- **default**: Standard alpha-numeric keyboard
- **number-pad**: Keyboard restricted to 0-9 digits plus decimals
- **decimal-pad**: Keyboard restricted to 0-9 digits with no decimals
- **phone-pad**: Keyboard restricted to digits and symbols that appear in phone numbers
- **email-address**: Keyboard adapted for easier email address input (handy @ symbol)

#### `mask`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A mask string that formats the user's input. If specificed, on every keystroke the input will be formatted using the mask, which may add characters to the field or prevent the pressed key from being set. Mask format:
- **9**: Accept numbers
- **A**: Accept alpha
- **S**: Accept alphanumerics
- **\***: Accept all

All other characters will automatically appear in the mask when the format is satisfied. For example:
```xml
<text-field name="phone" mask="(999) 999-9999" />
```
If the user types a `4`, the field will show `(4`. If the user tries to type the letter `A`, the field will still show `(4`.

#### `style`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to an `<text-field>`.

`<text-field>` supports the `focused` style modifier. See [Modifiers](/docs/reference_modifier) for more details.

#### `id`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A global attribute uniquely identifying the element in the whole document.

#### `hide`
| Type     | Required |
| -------- | -------- |
| **false** (default), true   | No       |

If `hide="true"`, the element will not be rendered on screen. If the element or any of the element's children have a behavior that triggers on "load" or "visible", those behaviors will not trigger while the element is hidden.
