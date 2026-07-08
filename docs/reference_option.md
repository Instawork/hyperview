---
id: reference_option
title: <option>
sidebar_label: <option>
---

The `<option>` element represents an input choice within a `<select-single>` or `<select-multiple>`. Options can be selected or deselected, which can be expressed visually using the "selected" style modifier.

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
  </select-single>
</form>
```

## Structure

A `<option>` element can appear anywhere within a `<select-single>` or `<select-multiple>` element.

## Attributes

- [`value`](#value)
- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)
- [`collapsable`](#collapsable)
- [`collapsable-children`](#collapsable-children)

#### `value`

| Type   | Required               |
| ------ | ---------------------- |
| string | No (defaults to blank) |

The value of the option. When selected, this value will be included in the [`<form>`](reference_form) data sent with remote requests.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to an `<option>` element.

`<option>` supports the `selected` style modifier. See [Modifiers](modifiers) for more details.

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

#### `collapsable`

| Type                      | Required |
| ------------------------- | -------- |
| **true** (default), false | No       |

When this element is only used to lay out its children, it may be automatically removed from the native view hierarchy as an optimization. Setting `collapsable="false"` disables this optimization and ensures the element exists in the native view hierarchy. See the [React Native docs](https://reactnative.dev/docs/view#collapsable) for details.

#### `collapsable-children`

| Type                      | Required |
| ------------------------- | -------- |
| **true** (default), false | No       |

Setting `collapsable-children="false"` prevents the direct children of this element from being removed from the native view hierarchy, similar to setting `collapsable="false"` on each child. See the [React Native docs](https://reactnative.dev/docs/view#collapsablechildren) for details.
