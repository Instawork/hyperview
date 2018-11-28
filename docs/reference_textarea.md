---
id: reference_textarea
title: "<text-area>"
sidebar_label: "<text-area>"
---

The `<text-area>` .

```xml
<screen>
  <text-area
    name="feedback"
    placeholder="Please leave your feedback"
  />
</screen>
```

## Structure
A `<text-area>` element can appear anywhere within a `<form>` element.

## Attributes
* [`name`](#name)
* [`value`](#value)
* [`placeholder`](#placeholder)
* [`style`](#style)
* [`id`](#id)
* [`hide`](#hide)

#### `name`
| Type     | Required |
| -------- | -------- |
| string   | **Yes**  |

The name of the text area within a `<form>` element. This name will be used when serializing a form to form data that gets sent in a server request.

#### `value`
| Type     | Required |
| -------- | -------- |
| string   | No (defaults to blank) |

The value of the text area. This string gets rendered into the string and can be edited by the user. Set this value in the XML to pre-populate the text area.

#### `placeholder`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A label that appears within the text area. The placeholder only appears when the text area is empty.

#### `style`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to an `<text-area>`.

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
