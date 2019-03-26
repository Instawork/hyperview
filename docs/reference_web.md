---
id: reference_web
title: <web>
sidebar_label: <web>
---

The `<web>` element shows a web view with HTML content loaded via a URL.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body style="Body">
      <web-view
        url="https://hyperview.org"
        activity-indicator-color="blue"
        injected-java-script="alert('Hello Hyperview user!')"
      />
    </body>
  </screen>
</doc>
```

## Structure

A `<web>` element can appear anywhere within a `<body>` element.

## Attributes

- [`url`](#color)
- [`activity-indicator-color`](#activity-indicator-color)
- [`injected-java-script`](#injected-java-script)
- [`id`](#id)
- [`style`](#style)

#### `url`

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

The URL to load in the web view.

#### `activity-indicator-color`

| Type   | Required |
| ------ | -------- |
| string | No       |

A hexadecimal string or supported color name indicating the color of the spinner shown while the web view loads.

#### `injected-java-script`

| Type   | Required |
| ------ | -------- |
| string | No       |

A string of Javascript that gets injected into the loaded web view. Can be used to customize the loaded website.

#### `id`

| Type   | Required |
| ------ | -------- |
| string | No       |

A global attribute uniquely identifying the element in the whole document.

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to a `<view>`.
