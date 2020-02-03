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
- [`cumulative`](#cumulative)
- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)

#### `name`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

The name of the selection input within a `<form>` element. This name will be used when serializing a form to form data that gets sent in a server request.

#### `cumulative`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

Use `cumulative="true"` to render all preceding `<option>`s as selected and all subsequent `<options>` as unselected. The most frequent application is for rating UIs, like a 1-5 star rating. For example:

```xml
<select-single style="Stars" cumulative="true">
  <option style="Star" value="1" />
  <option style="Star" value="2" />
  <option style="Star" value="3" />
  <option style="Star" value="4" />
  <option style="Star" value="5" />
</select-single>
```

When the user presses the star option with value 3, stars 1 and 2 will also render as selected. However, the `<select-single>` input will only have a value of 3.

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
