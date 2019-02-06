---
id: reference_selectsingle
title: <select-single>
sidebar_label: <select-single>
---

The `<select-single>` element represents a user input widget that allows one option to be selected. `<select-single>` contains `<option>` elements and ensures that only one of those options can be selected at any given time.

```xml
<form>
  <select-single name="grade">
    <option value="1" selected="true">
      <text>1st grade</text>
    </option>

    <option value="2">
      <text>2nd grade</text>
    </option>

    <option value="3">
      <text>3rd grade</text>
    </option>
  <select-single/>
</form>
```

If the user presses "2nd grade", the `<option>` element with `value="2"` will get the attribute `selected="true"`, while the first option will get `selected="false"`.

## Structure

A `<select-single>` element most often appears within a `<form>` element. However, this is not a requirement, and the element can be used for local interactions that don't get serialized in a form (for example, to implement a tab interface).

## Attributes

- [`name`](#name)
- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)

#### `name`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

The name of the selection input within a `<form>` element. This name will be used when serializing a form to form data that gets sent in a server request.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to a `<select-single>`.

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
