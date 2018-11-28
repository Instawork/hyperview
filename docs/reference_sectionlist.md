---
id: reference_sectionlist
title: "<section-list>"
sidebar_label: "<section-list>"
---

The `<section-list>` element represents a sectioned list of items. Each section of the list has a sticky title bar, followed by a list of items. Unlike child elements of s `<view>`, children in a `<section-list>` undergo optimizations to efficiently render hundres of items.

```xml
<section-list style="List">
  <section>
    <section-title style="Header">
      <text>Section 1</text>
    </section-title>

    <item key="a" style="Item">
      <text>Item 1</text>
    </item>
  </section>

  <section>
    <section-title style="Header">
      <text>Section 1</text>
    </section-title>

    <item key="b" style="Item">
      <text>Section 2</text>
    </item>
  </section>
</section-list>
```

## Structure
A `<section-list>` element will only render `<section>` children elements. Other elements will be ignored during rendering.

## Attributes
* [Behavior attributes](#behavior-attributes)
* [`style`](#style)
* [`id`](#id)
* [`hide`](#hide)

#### Behavior attributes
A sectino list will accept the standard [behavior attributes](/docs/reference_behavior_attributes). However, a section list will only trigger the `refresh` behavior (through the pull-to-refresh gesture). Other behaviors, such as presses, should be handled by the `<item>` elements in the section list.

#### `style`
| Type     | Required |
| -------- | -------- |
| string   | No       |

A space-separated list of styles to apply to the text. See [Styles](/docs/reference_style).

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
