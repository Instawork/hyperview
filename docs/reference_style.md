---
id: reference_style
title: <style>
sidebar_label: <style>
---

The `<style>` element defines specific style rules that can be used by elements of a screen.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <styles>
      <style id="Main"
        flex="1"
        backgroundColor="red"
      />
    </styles>
    <body>
      <view style="Main" />
    </body>
  </screen>
</doc>
```

The `<styles>` element above contains one [`<style>`](/docs/reference_style) with id "Main". The view in the body of the screen uses that style.

## Structure

A `<style>` element should only appear as a direct child of a `<styles>` element or `<modifier>` element.

## Attributes

- [`id`](#id)
- [Layout rules](#layout-rules)

  - [`alignContent`](#aligncontent)
  - [`alignItems`](#alignitems)
  - [`alignSelf`](#alignself)
  - [`borderBottomWidth`](#borderbottomwidth)
  - [`borderLeftWidth`](#borderleftwidth)
  - [`borderRightWidth`](#borderrightwidth)
  - [`borderTopWidth`](#bordertopwidth)
  - [`borderWidth`](#borderwidth)
  - [`bottom`](#bottom)
  - [`display`](#display)
  - [`flex`](#flex)
  - [`flexBasis`](#flexbasis)
  - [`flexDirection`](#flexdirection)
  - [`flexGrow`](#flexgrow)
  - [`flexShrink`](#flexshrink)
  - [`flexWrap`](#flexwrap)
  - [`height`](#height)
  - [`justifyContent`](#justifycontent)
  - [`left`](#left)
  - [`margin`](#margin)
  - [`marginBottom`](#marginbottom)
  - [`marginHorizontal`](#marginhorizontal)
  - [`marginLeft`](#marginleft)
  - [`marginRight`](#marginright)
  - [`marginTop`](#margintop)
  - [`marginVertical`](#marginvertical)
  - [`maxHeight`](#maxheight)
  - [`maxWidth`](#maxwidth)
  - [`minHeight`](#minheight)
  - [`minWidth`](#minwidth)
  - [`overflow`](#overflow)
  - [`padding`](#padding)
  - [`paddingBottom`](#paddingbottom)
  - [`paddingHorizontal`](#paddinghorizontal)
  - [`paddingLeft`](#paddingleft)
  - [`paddingRight`](#paddingright)
  - [`paddingTop`](#paddingtop)
  - [`paddingVertical`](#paddingvertical)
  - [`position`](#position)
  - [`right`](#right)
  - [`top`](#top)
  - [`width`](#width)
  - [`zIndex`](#zIndex)

- [View & image rules](#view-image-rules)

  - [`borderRightColor`](#borderrightcolor)
  - [`borderBottomColor`](#borderbottomcolor)
  - [`borderBottomLeftRadius`](#borderbottomleftradius)
  - [`borderBottomRightRadius`](#borderbottomrightradius)
  - [`borderColor`](#bordercolor)
  - [`borderLeftColor`](#borderleftcolor)
  - [`borderRadius`](#borderradius)
  - [`backgroundColor`](#backgroundcolor)
  - [`borderStyle`](#borderstyle)
  - [`borderTopColor`](#bordertopcolor)
  - [`borderTopLeftRadius`](#bordertopleftradius)
  - [`borderTopRightRadius`](#bordertoprightradius)
  - [`elevation`](#elevation)
  - [`opacity`](#opacity)
  - [`shadowColor`](#shadowcolor)
  - [`shadowOffsetX`](#shadowoffsetx)
  - [`shadowOffsetY`](#shadowoffsety)
  - [`shadowOpacity`](#shadowopacity)
  - [`shadowRadius`](#shadowradius)

- [Text rules](#text-rules)
  - [`color`](#color)
  - [`fontSize`](#fontsize)
  - [`fontStyle`](#fontstyle)
  - [`fontWeight`](#fontweight)
  - [`lineHeight`](#lineheight)
  - [`textAlign`](#textalign)
  - [`textShadowColor`](#textshadowcolor)
  - [`fontFamily`](#fontfamily)
  - [`textShadowRadius`](#textshadowradius)

### `id`

| Type   | Required |
| ------ | -------- |
| string | No       |

A global attribute uniquely identifying the element in the whole document. This id is used by elements in the `<screen>` to apply styles.

> `id` is required when `<style>` is a direct child of a `<styles>` element. `id` will be ignored if the `<style>` is a direct child of a `<modifier>` element.

### Layout rules

`<style>` attributes support the following [layout props](https://facebook.github.io/react-native/docs/layout-props) from React Native.

> Layout rules can only be applied to most elements with a few exceptions (such as `<spinner>`).

#### `alignContent`

`alignContent` controls how rows align in the cross direction, overriding the `alignContent` of the parent. See https://developer.mozilla.org/en-US/docs/Web/CSS/align-content for more details.

| Type                                                                           | Required |
| ------------------------------------------------------------------------------ | -------- |
| 'flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around' | No       |

#### `alignItems`

`alignItems` aligns children in the cross direction. For example, if children are flowing vertically, `alignItems` controls how they align horizontally. It works like `align-items` in CSS (default: stretch). See https://developer.mozilla.org/en-US/docs/Web/CSS/align-items for more details.

| Type                                                      | Required |
| --------------------------------------------------------- | -------- |
| 'flex-start', 'flex-end', 'center', 'stretch', 'baseline' | No       |

#### `alignSelf`

`alignSelf` controls how a child aligns in the cross direction, overriding the `alignItems` of the parent. It works like `align-self` in CSS (default: auto). See https://developer.mozilla.org/en-US/docs/Web/CSS/align-self for more details.

| Type                                                              | Required |
| ----------------------------------------------------------------- | -------- |
| 'auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline' | No       |

#### `borderBottomWidth`

`borderBottomWidth` works like `border-bottom-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `borderLeftWidth`

`borderLeftWidth` works like `border-left-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `borderRightWidth`

`borderRightWidth` works like `border-right-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `borderTopWidth`

`borderTopWidth` works like `border-top-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `borderWidth`

`borderWidth` works like `border-width` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/border-width for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `bottom`

`bottom` is the number of logical pixels to offset the bottom edge of this component.

It works similarly to `bottom` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/bottom for more details of how `bottom` affects layout.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `display`

`display` sets the display type of this component.

It works similarly to `display` in CSS, but only support 'flex' and 'none'. 'flex' is the default.

| Type           | Required |
| -------------- | -------- |
| 'none', 'flex' | No       |

#### `flex`

When `flex` is a positive number, it makes the component flexible and it will be sized proportional to its flex value. So a component with `flex` set to 2 will take twice the space as a component with `flex` set to 1.

When `flex` is 0, the component is sized according to `width` and `height` and it is inflexible.

When `flex` is -1, the component is normally sized according `width` and `height`. However, if there's not enough space, the component will shrink to its `minWidth` and `minHeight`.

flexGrow, flexShrink, and flexBasis work the same as in CSS.

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `flexBasis`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `flexDirection`

`flexDirection` controls which directions children of a container go. `row` goes left to right, `column` goes top to bottom, and you may be able to guess what the other two do. It works like `flex-direction` in CSS, except the default is `column`. See https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction for more details.

| Type                                             | Required |
| ------------------------------------------------ | -------- |
| 'row', 'row-reverse', 'column', 'column-reverse' | No       |

#### `flexGrow`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `flexShrink`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `flexWrap`

`flexWrap` controls whether children can wrap around after they hit the end of a flex container. It works like `flex-wrap` in CSS (default: nowrap). See https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap for more details. Note it does not work anymore with `alignItems: stretch` (the default), so you may want to use `alignItems: flex-start` for example.

| Type             | Required |
| ---------------- | -------- |
| 'wrap', 'nowrap' | No       |

#### `height`

`height` sets the height of this component.

It works similarly to `height` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported. See https://developer.mozilla.org/en-US/docs/Web/CSS/height for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `justifyContent`

`justifyContent` aligns children in the main direction. For example, if children are flowing vertically, `justifyContent` controls how they align vertically. It works like `justify-content` in CSS (default: flex-start). See https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content for more details.

| Type                                                                                | Required |
| ----------------------------------------------------------------------------------- | -------- |
| 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly' | No       |

#### `left`

`left` is the number of logical pixels to offset the left edge of this component.

It works similarly to `left` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/left for more details of how `left` affects layout.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `margin`

Setting `margin` has the same effect as setting each of `marginTop`, `marginLeft`, `marginBottom`, and `marginRight`. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `marginBottom`

`marginBottom` works like `margin-bottom` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `marginHorizontal`

Setting `marginHorizontal` has the same effect as setting both `marginLeft` and `marginRight`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `marginLeft`

`marginLeft` works like `margin-left` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `marginRight`

`marginRight` works like `margin-right` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `marginTop`

`marginTop` works like `margin-top` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `marginVertical`

Setting `marginVertical` has the same effect as setting both `marginTop` and `marginBottom`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `maxHeight`

`maxHeight` is the maximum height for this component, in logical pixels.

It works similarly to `max-height` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/max-height for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `maxWidth`

`maxWidth` is the maximum width for this component, in logical pixels.

It works similarly to `max-width` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/max-width for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `minHeight`

`minHeight` is the minimum height for this component, in logical pixels.

It works similarly to `min-height` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/min-height for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `minWidth`

`minWidth` is the minimum width for this component, in logical pixels.

It works similarly to `min-width` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/min-width for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `overflow`

`overflow` controls how children are measured and displayed. `overflow: hidden` causes views to be clipped while `overflow: scroll` causes views to be measured independently of their parents main axis. It works like `overflow` in CSS (default: visible). See https://developer.mozilla.org/en/docs/Web/CSS/overflow for more details. `overflow: visible` only works on iOS. On Android, all views will clip their children.

| Type                          | Required |
| ----------------------------- | -------- |
| 'visible', 'hidden', 'scroll' | No       |

#### `padding`

Setting `padding` has the same effect as setting each of `paddingTop`, `paddingBottom`, `paddingLeft`, and `paddingRight`. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `paddingBottom`

`paddingBottom` works like `padding-bottom` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `paddingHorizontal`

Setting `paddingHorizontal` is like setting both of `paddingLeft` and `paddingRight`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `paddingLeft`

`paddingLeft` works like `padding-left` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `paddingRight`

`paddingRight` works like `padding-right` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `paddingTop`

`paddingTop` works like `padding-top` in CSS. See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `paddingVertical`

Setting `paddingVertical` is like setting both of `paddingTop` and `paddingBottom`.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `position`

`position` in Hyperview is similar to regular CSS, but everything is set to `relative` by default, so `absolute` positioning is always just relative to the parent.

If you want to position a child using specific numbers of logical pixels relative to its parent, set the child to have `absolute` position.

If you want to position a child relative to something that is not its parent, just don't use styles for that. Use the component tree.

| Type                   | Required |
| ---------------------- | -------- |
| 'absolute', 'relative' | No       |

#### `right`

`right` is the number of logical pixels to offset the right edge of this component.

It works similarly to `right` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/right for more details of how `right` affects layout.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `top`

`top` is the number of logical pixels to offset the top edge of this component.

It works similarly to `top` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported.

See https://developer.mozilla.org/en-US/docs/Web/CSS/top for more details of how `top` affects layout.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `width`

`width` sets the width of this component.

It works similarly to `width` in CSS, but in Hyperview you must use points or percentages. Ems and other units are not supported. See https://developer.mozilla.org/en-US/docs/Web/CSS/width for more details.

| Type           | Required |
| -------------- | -------- |
| number, string | No       |

#### `zIndex`

`zIndex` sets the stack order of a positioned element and its descendents or flex items.

It works similarly to `zIndex` in CSS, but in Hyperview you must use only integers. See https://developer.mozilla.org/en-US/docs/Web/CSS/z-index for more details.

| Type   | Required |
| ------ | -------- |
| number | No       |

### View & image rules

`<style>` elements support the following attributes for `<view>` and `<image>` as defined in [React Native](https://facebook.github.io/react-native/docs/view-style-props).

> View rules will only be applied to `<view>` and `<image>` elements. Adding these rules to other elements will cause a warning in the client.

#### `borderRightColor`

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `borderBottomColor`

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `borderBottomLeftRadius`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `borderBottomRightRadius`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `borderColor`

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `borderLeftColor`

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `borderRadius`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `backgroundColor`

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `borderStyle`

| Type                        | Required |
| --------------------------- | -------- |
| 'solid', 'dotted', 'dashed' | No       |

#### `borderTopColor`

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `borderTopLeftRadius`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `borderTopRightRadius`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `elevation`

**NOTE**: Elevation only works on Android. For iOS, use [shadow style attributes](#shadowcolor).

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `opacity`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `shadowColor`

**NOTE**: `shadowColor` only works on iOS. For Android, use [elevation](#elevation).

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `shadowOffsetX`

**NOTE**: `shadowColor` only works on iOS. For Android, use [elevation](#elevation).

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `shadowOffsetY`

**NOTE**: `shadowColor` only works on iOS. For Android, use [elevation](#elevation).

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `shadowOpacity`

**NOTE**: `shadowColor` only works on iOS. For Android, use [elevation](#elevation).

| Type        | Required |
| ----------- | -------- |
| float (0-1) | No       |

#### `shadowRadius`

**NOTE**: `shadowColor` only works on iOS. For Android, use [elevation](#elevation).

| Type   | Required |
| ------ | -------- |
| number | No       |

### Text rules

`<style>` elements support the following attributes for `<text>` as defined in [React Native](https://facebook.github.io/react-native/docs/text-style-props).

> Text rules will only be applied to `<text>` elements. Adding these rules to other elements will cause a warning in the client.

#### `color`

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `fontSize`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `fontStyle`

| Type               | Required |
| ------------------ | -------- |
| 'normal', 'italic' | No       |

#### `fontWeight`

fromSpecifies font weight. The values 'normal' and 'bold' are supported for most fonts. Not all fonts have a variant for each of the numeric values, in that case the closest one is chosen.

| Type                                                                            | Required |
| ------------------------------------------------------------------------------- | -------- |
| 'normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900' | No       |

#### `lineHeight`

| Type   | Required |
| ------ | -------- |
| number | No       |

#### `textAlign`

Specifies text alignment. The value 'justify' is only supported on iOS and fallbacks to `left` on Android.

| Type                                         | Required |
| -------------------------------------------- | -------- |
| 'auto', 'left', 'right', 'center', 'justify' | No       |

#### `textShadowColor`

| Type  | Required |
| ----- | -------- |
| color | No       |

#### `fontFamily`

| Type   | Required |
| ------ | -------- |
| string | No       |

#### `textShadowRadius`

| Type   | Required |
| ------ | -------- |
| number | No       |
