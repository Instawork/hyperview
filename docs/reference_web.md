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
        show-loading-indicator="document-only"
      />
    </body>
  </screen>
</doc>
```

## Structure

A `<web-view>` element can appear anywhere within a `<body>` element.

## Attributes

- [`url`](#url)
- [`html`](#html)
- [`activity-indicator-color`](#activity-indicator-color)
- [`injected-java-script`](#injected-java-script)
- [`show-loading-indicator`](#show-loading-indicator)
- [`id`](#id)

#### `url`

| Type   | Required                                 |
| ------ | ---------------------------------------- |
| string | **Yes** (unless `html` attribute is set) |

The URL to load in the web view.

#### `html`

| Type   | Required                                |
| ------ | --------------------------------------- |
| string | **Yes** (unless `url` attribute is set) |

The HTML content to load in the web view.

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

#### `show-loading-indicator`

| Type   | Required |
| ------ | -------- |
| **all** (default), document-only | No       |

An attribute specifying when to stop showing the web-view's loader. `document-only` specifies to stop loading after the document renders but before other subresources load. By default (`all`), shows loader until the whole page loads.

#### `id`

| Type   | Required |
| ------ | -------- |
| string | No       |

A global attribute uniquely identifying the element in the whole document.

## Dispatching events from web views

[Hyperview events](/docs/example_event_dispatch) can be dispatched from the javascript context of a web view using `window.ReactNativeWebView.postMessage` API. The message must be prefixed with the string `hyperview:`.

Example:

Web page JS code:

```js
window.ReactNativeWebView.postMessage('hyperview:open-modal');
```

XML markup:

```xml
<behavior
  action="new"
  event-name="open-modal"
  trigger="on-event"
  href="/modal.xml"
/>
```
