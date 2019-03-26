---
id: reference_web
title: <web-view>
sidebar_label: <web-view>
---

The `<web-view>` element shows a web view with HTML content loaded via a URL.

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

A `<web-view>` element can appear anywhere within a `<body>` element.

## Attributes

- [`url`](#color)
- [`activity-indicator-color`](#activity-indicator-color)
- [`injected-java-script`](#injected-java-script)
- [`id`](#id)

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
