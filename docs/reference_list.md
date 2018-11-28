---
id: reference_list
title: "<list>"
sidebar_label: "<list>"
---

The `<list>` element represents a list of items. Unlike child elements of a `<view>`, children of a `<list>` element undergo optimizations to efficiently render hundreds of items.

```xml
<list style="MyList">
  <item key="a">
    <text>Item A</text>
  </item>

  <item key="b">
    <text>Item B</text>
  </item>

  <item key="c">
    <text>Item C</text>
  </item>
</list>
```

## Structure
A `<list>` element will only render `<item>` children elements. Other elements will be ignored during rendering.

## Attributes
* [Behavior attributes](#behavior-attributes)
* [`style`](#style)
* [`itemHeight`](#itemheight)
* [`id`](#id)
* [`hide`](#hide)


#### Behavior attributes
A list will accept the standard [behavior attributes](/docs/reference_behavior_attributes). However, a list will only trigger the `refresh` behavior (through the pull-to-refresh gesture). Other behaviors, such as presses, should be handled by the `<item>` elements in the list.

#### `style`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A space-separated list of styles to apply to the text. See [Styles](/docs/reference_style).

#### `itemHeight`
| Type     | Required |
| -------- | -------- |
| integer  | No       |

An optional number that fixes the height of every item in the list. The presence of this property helps optimize layout for very long lists, by simplifying the calculation for which items are on screen.

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
