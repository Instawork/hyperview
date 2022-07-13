---
id: reference_image
title: <image>
sidebar_label: <image>
---

The `<image>` element displays an image on the screen. Image data can be provided as a local resource (bundled with the mobile app), a remote resource fetched from a server, or a image encoded into the URI.

```xml
<screen>
  <styles>
    <style id="Image" flex="1" height="128" margin="24" width="128" />
    <style
      id="Image__Styled"
      borderColor="#e1e1e1"
      borderRadius="64"
      borderWidth="4"
    />
  </styles>
  <body scroll="true">
    <image source="/ui_elements/image.jpg" style="Image" />
    <image source="/ui_elements/image.jpg" style="Image Image__Styled" />
  </body>
</screen>
```

## Structure

An `<image>` element can appear anywhere within a `<screen>` element (including in the body or header).

## Attributes

- [Behavior attributes](#behavior-attributes)
- [`source`](#source)
- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)

#### Behavior attributes

An `<image>` element accepts the standard [behavior attributes](/docs/reference_behavior_attributes), including all triggers (press, refresh, visible, etc).

#### `source`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

A URI specifying the resource with image data. The URI must follow one of the following formats:

- **Absolute URL**: eg `http://s3.amazonaws.com/instawork/profile.png`. The image will be requested from the remote server.
- **Relative URL**: eg `/img/profile.png`. The image will be requested from a remote server. The host will be the same as the screen's host. For example, if the screen was loaded from `https://instawork.com/about`, the image would be requested from `https://instawork.com/img/profile.png`.
- **Local URL**: eg `./profile.png`. This image must be bundled as an asset in the mobile app.
- **Data URI**: eg `data:image/png;base64,iVBORw`. The image data is encoded in the attribute, so no requests will need to be made.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to an `<image>`.

> **NOTE**: Most elements in Hyperview do not require an applied style, but images require a style with rules that specify `width` and `height`. Without a style that specifies image dimensions, the image will render as using 0x0 dimensions and won't appear on the screen.

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
