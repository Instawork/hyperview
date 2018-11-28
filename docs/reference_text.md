---
id: reference_text
title: "<text>"
sidebar_label: "<text>"
---

The `<text>` element is a basic building block to show text content in the UI layout. Text elements can by styled typographically with style rules.

Some examples of styles applied to text (including nested text):
```xml
<screen>
  <styles>
    <style fontFamily="HKGrotesk-Regular"
           fontSize="16"
           id="Description"
           margin="24"
           marginBottom="0" />
    <style fontFamily="HKGrotesk-Medium"
           fontSize="24"
           id="Basic"
           margin="24" />
    <style fontFamily="HKGrotesk-Bold"
           fontSize="16"
           id="Bold"
           margin="24" />
    <style backgroundColor="#63CB76"
           color="white"
           fontFamily="HKGrotesk-Bold"
           fontSize="32"
           id="Color"
           margin="24"
           padding="16" />
  </styles>
  <body scroll="true">
    <text style="Basic">Hello, world!</text>

    <text style="Basic">Hello, 
      <text style="Bold">World of 
        <text style="Color">HyperView!</text>
      </text>
    </text>
  </body>
</screen>

```

## Structure
A `<view>` element can only appear anywhere within a `<screen>` element.

## Attributes
* [Behavior attributes](#behavior-attributes)
* [`style`](#style)
* [`number-of-lines`](#number-of-lines)
* [`id`](#id)
* [`hide`](#hide)

#### Behavior attributes
A `<view>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), including all triggers (press, refresh, visible, etc).

#### `style`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules will cannot be applied to a `<view>`.

#### `number-of-lines`
| Type     | Required |
| -------- | -------- |
| integer  | No       |

An integer representing the number of lines of text to display before the text content truncates. The width of the element is determined by the applied styles and the dimensions of the device screen.

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
