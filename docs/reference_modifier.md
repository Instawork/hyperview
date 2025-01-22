---
id: reference_modifier
title: <modifier>
sidebar_label: <modifier>
---

The `<modifier>` element defines temporary overrides of a style rule, given some local state of interactive UI elements.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <styles>
      <style
        id="Input"
        borderBottomColor="#E1E1E1"
        borderBottomWidth="1"
        fontFamily="HKGrotesk-Regular"
        fontSize="16"
        paddingBottom="8"
      >
        <modifier focused="true">
          <style borderBottomColor="#4778FF" />
        </modifier>
      </style>
    </styles>
    <body>
      <text-field style="Input" value="Hello" />
    </body>
  </screen>
</doc>
```

The `<style id="Input">` element above contains a `<modifier>` with attribute `focused="true"`. When the style is applied to a focusable element (in this case, a `<text-field>`) and the element is focused, the style rule attributes in the modifier will be merged with the default style rules. In the example above, the bottom border of the text field will change from `#E1E1E1` to `#4778FF` when the field is focused.

The modifier state applies to all child elements of the parent:

```
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <styles>
      <style
        id="Button"
        backgroundColor="#EEE"
        padding="24"
      >
        <modifier pressed="true">
          <style backgroundColor="#AAA" />
        </modifier>
      </style>

      <style
        id="Button__Label"
        color="#000"
      >
        <modifier pressed="true">
          <style color="red" />
        </modifier>
      </style>
    </styles>
    <body>
      <view style="Button" href="/next-screen">
        <text style="Button__Label">Press me</text>
      </view>
    </body>
  </screen>
</doc>
```

In the example above, when touching the button, the `<view>` element will get the "pressed" state. The "pressed" style modifier will kick in, changing the color of the `<view>` to "#AAA". However, the "pressed" state will also apply to the child `<text>` element. Since the text element's style rule also has a "pressed" modifier, then the text color will change to red.

Keep in mind that `pressed` styles will only have any effect when an element is actually pressable, that is, when the element has some kind of behavior attached to it via an `href` and other behavior attributes.

## Structure

A `<modifier>` element should only appear as a direct child of a `<style>` element. A `<style>` element can contain several `<modifier>` elements.

## Attributes

- [focused](#focused)
- [pressed](#pressed)
- [selected](#selected)

#### `focused`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

Setting this attribute to "true" means the modifier rules will only be applied when the element is focused. This attribute can be combined with `pressed`. For example, we can define a modifier to apply when pressing a focused element:

```xml
<modifier focused="true" pressed="true" />
```

Or when pressing a blurred element:

```xml
<modifier focused="false" pressed="true" />
```

The "focused" modifier only applies to elements that can be focused:

- [`<text-field>`](/docs/reference_textfield)

#### `pressed`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

Setting this attribute to "true" means the modifier rules will only be applied when the element is being pressed. This attribute can be combined with `focused` or `selected`. For example, we can define a modifier to apply when a focused element is pressed:

```xml
<modifier focused="true" pressed="true" />
```

Or when a focused element is not pressed:

```xml
<modifier focused="true" pressed="false" />
```

The "pressed" modifier applies to any elements that can be triggered by a `pressIn`:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)

#### `selected`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

Setting this attribute to "true" means the modifier rules will only be applied when the element is "Selected". This attribute can be combined with `pressed`. For example, we can define a modifier to apply when a selected element is pressed:

```xml
<modifier selected="true" pressed="true" />
```

Or when a selected element is not pressed:

```xml
<modifier selected="true" pressed="false" />
```

The "pressed" modifier applies to any elements that can be triggered by a `select`:

- [`<option>`](/docs/reference_option)
