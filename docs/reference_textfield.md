---
id: reference_textfield
title: <text-field>
sidebar_label: <text-field>
---

The `<text-field>` element represents a single-line input field. When pressed, the field focuses and a keyboard appears to accept user input. The value entered into the `<text-field>` get serialized as form data when a `<form>` gets submitted.

```xml

```

## Structure

A `<text-field>` element can appear anywhere within a `<form>` element.

## Attributes

- [`name`](#name)
- [`value`](#value)
- [`placeholder`](#placeholder)
- [`placeholderTextColor`](#placeholdertextcolor)
- [`selectionColor`](#selectioncolor)
- [`cursorColor`](#cursorcolor)
- [`multiline`](#multiline)
- [`keyboard-type`](#keyboard-type)
- [`mask`](#mask)
- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)
- [`auto-focus`](#auto-focus)
- [`secure-text`](#secure-text)
- [`text-content-type`](#text-content-type)
- [`allowFontScaling`](#allowFontScaling)
- [`maxFontSizeMultiplier`](#maxFontSizeMultiplier)
- [`minimumFontScale`](#minimumFontScale)
- [`on-submit-editing-event`](#on-submit-editing-event)

#### Behavior attributes

A `<text-field>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), including the following triggers:

- [blur](/docs/reference_behavior_attributes#blur)
- [change](/docs/reference_behavior_attributes#change)
- [focus](/docs/reference_behavior_attributes#focus)

#### `name`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

The name of the field within a `<form>` element. This name will be used when serializing a form to form data that gets sent in a server request.

#### `value`

| Type   | Required               |
| ------ | ---------------------- |
| string | No (defaults to blank) |

The value of the field. This string gets rendered into the string and can be edited by the user. Set this value in the XML to pre-populate the text field.

#### `placeholder`

| Type   | Required |
| ------ | -------- |
| string | No       |

A label that appears within the text field. The placeholder only appears when the field is empty.

#### `placeholderTextColor`

| Type   | Required |
| ------ | -------- |
| string | No       |

The text color of the placeholder string.

#### `selectionColor`

| Type   | Required |
| ------ | -------- |
| string | No       |

The highlight, selection handle and cursor color of the text input.

#### `selectionHandleColor` (Android)

| Type   | Required |
| ------ | -------- |
| string | No       |

Sets the color of the selection handle. Unlike `selectionColor`, it allows the selection handle color to be customized independently of the selection's color.

#### `cursorColor` (Android)

| Type   | Required |
| ------ | -------- |
| string | No       |

When provided it will set the color of the cursor (or "caret") in the component. Unlike the behavior of `selectionColor` the cursor color will be set independently from the color of the text selection box.

#### `multiline`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

When `true`, allows the text input to have multiple lines.

#### `keyboard-type`

| Type   | Required                     |
| ------ | ---------------------------- |
| string | No (defaults to **default**) |

Sets the type of keybaord to show when the user focuses the input. Supported options:

- **default**: Standard alpha-numeric keyboard
- **number-pad**: Keyboard restricted to 0-9 digits plus decimals
- **decimal-pad**: Keyboard restricted to 0-9 digits with no decimals
- **phone-pad**: Keyboard restricted to digits and symbols that appear in phone numbers
- **email-address**: Keyboard adapted for easier email address input (handy `@` symbol)
- **url**: Keyboard adapted for easier URL input (`.`, `/` and `.com` in place of space bar)
- **ascii-capable**(iOS only): Similar to the default keyboard, without emojis
- **numbers-and-punctuation**(iOS only): Keyboard that opens by default on the page with numbers and punctuation. User can switch back to first page showing alphabetical characters.
- **name-phone-pad**(iOS only): Keyboard that opens by default on the page with alphabetical characters, where user can switch to second page showing a phone pad (useful to search for contacts, either by their name, or phone number).
- **twitter**(iOS only): Keyboard with `@` and `#` keys in place of "Return" key
- **web-search**(iOS only): Keyboard with "Go" key im place of "Return" key

#### `mask`

| Type   | Required |
| ------ | -------- |
| string | No       |

A mask string that formats the user's input. If specificed, on every keystroke the input will be formatted using the mask, which may add characters to the field or prevent the pressed key from being set. Mask format:

- **9**: Accept numbers
- **A**: Accept alpha
- **S**: Accept alphanumerics
- **\***: Accept all

All other characters will automatically appear in the mask when the format is satisfied. For example:

```xml

```

If the user types a `4`, the field will show `(4`. If the user tries to type the letter `A`, the field will still show `(4`.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to an `<text-field>`.

`<text-field>` supports the `focused` style modifier. See [Modifiers](/docs/reference_modifier) for more details.

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

#### `auto-focus`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

If `auto-focus="true"`, the element will steal focus the moment it's rendered.

#### `secure-text`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

If `secure-text="true"`, the input in the text field will be obscured. Appropriate to use for passwords or other sensitive information.

## `text-content-type` (iOS)

| Type                                                                                                                                                                                                                                                                                                                                                                                           | Required |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **none** (default), none, URL, addressCity, addressCityAndState, addressState, countryName, creditCardNumber, emailAddress, familyName, fullStreetAddress, givenName, jobTitle, location, middleName, name, namePrefix, nameSuffix, nickname, organizationName, postalCode, streetAddressLine1, streetAddressLine2, sublocality, telephoneNumber, username, password, newPassword, oneTimeCode | No       |

The `text-content-type` autofills available fields (for example, for iOS 12+ `oneTimeCode` can be used to indicate that a field can be autofilled by a code arriving in an SMS).

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

#### `#on-submit-editing-event`

| Type   | Required |
| ------ | -------- |
| string | No       |

An event to dispatch when the field is submitted. See [`on-event`](/docs/reference_behavior_attributes#on-event).
