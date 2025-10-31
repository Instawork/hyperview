---
id: reference_sectionlist
title: <section-list>
sidebar_label: <section-list>
---

The `<section-list>` element represents a sectioned list of items. Each section of the list has a sticky title bar, followed by a list of items. Unlike child elements of s `<view>`, children in a `<section-list>` undergo optimizations to efficiently render hundres of items.

```xml
<section-list style="List">
  <section-title style="Header">
    <text>Section 1</text>
  </section-title>

  <item key="a" style="Item">
    <text>Item 1</text>
  </item>

  <section-title style="Header">
    <text>Section 1</text>
  </section-title>

  <item key="b" style="Item">
    <text>Section 2</text>
  </item>
</section-list>
```

## Structure

A `<section-list>` element will only render `<section-title>` and `<item>` children elements. Other elements will be ignored during rendering.

## Attributes

- [Behavior attributes](#behavior-attributes)
- [`style`](#style)
- [`content-container-style`](#content-container-style)
- [`id`](#id)
- [`hide`](#hide)
- [`scroll-orientation`](#scroll-orientation)
- [`shows-scroll-indicator`](#shows-scroll-indicator)
- [`sticky-section-titles`](#sticky-section-titles)
- [`keyboard-dismiss-mode`](#keyboard-dismiss-mode)
- [`keyboard-should-persist-taps`](#keyboard-should-persist-taps)
- [`over-scroll`](#over-scroll)

#### Behavior attributes

A section list will accept the standard [behavior attributes](/docs/reference_behavior_attributes). However, a section list will only trigger the `refresh` behavior (through the pull-to-refresh gesture). Other behaviors, such as presses, should be handled by the `<item>` elements in the section list.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the text. See [Styles](/docs/reference_style).

#### `content-container-style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the content container element of the scrollable view. See [Styles](/docs/reference_style).

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

#### `scroll-orientation`

| Type                               | Required |
| ---------------------------------- | -------- |
| **vertical** (default), horizontal | No       |

An attribute indicating the direction in which the body will scroll.

#### `shows-scroll-indicator`

| Type                      | Required |
| ------------------------- | -------- |
| **true** (default), false | No       |

An attribute indicating whether the scroll bar should be shown.

### `sticky-section-titles`

| Type        | Required |
| ----------- | -------- |
| true, false | No       |

When set to `"true"`, the section titles will remain sticky at the top of their section items, as the list is being scrolled. When set to `"false"`, the section titles will scroll along with the items of the list. When not explicitly set, the section titles will adopt the platform behaviors: sticky on iOS, not sticky on Android.

#### `keyboard-dismiss-mode`

| Type                                         | Required |
| -------------------------------------------- | -------- |
| **none** (default), `on-drag`, `interactive` | No       |

An attribute that controls the virtual keyboard behavior when the scrollable view is interacted with. Note: `interactive` value is only supported on iOS. When set to this value, the keyboard is dismissed interactively with the drag and moves in synchrony with the touch, dragging upwards cancels the dismissal. On Android this is not supported and it will have the same behavior as `none`.

#### `keyboard-should-persist-taps`

| Type                                     | Required |
| ---------------------------------------- | -------- |
| **never** (default), `always`, `handled` | No       |

An attribute that controls the virtual keyboard behavior when the scrollable view is tapped.

#### `over-scroll`

| Type                      | Required |
| ------------------------- | -------- |
| **true** (default), false | No       |

An attribute that helps disabling the "over-scroll" or "bounce" effect when reaching the beginning or end of the scrollable content.
