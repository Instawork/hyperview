---
id: reference_pickeritem
title: <picker-item>
sidebar_label: <picker-item>
---

The `<picker-item>` element represents a value choice in a [`<picker-field>`](/docs/reference_pickerfield) element.

```xml
<picker-field
  field-style="Input"
  field-text-style="Input__Text"
  placeholder="Select choice"
>
  <picker-item label="Choice 0" value="0" />
  <picker-item label="Choice 1" value="1" />
</picker-field>
```

## Structure

A `<picker-item`> element must only appear as a direct child of a [`<picker-field>`](/docs/reference_pickerfield) element and must not contain any child elements itself.

## Attributes

- [`label`](#label)
- [`value`](#value)

#### `label`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

The label that will appear in the picker. This is what the user sees when picking a value.

#### `value`

| Type   | Required               |
| ------ | ---------------------- |
| string | No (defaults to blank) |

The value of the picker item. This is the value that will get serialized in the form containing the picker field.
