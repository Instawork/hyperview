---
id: reference_behavior_share
title: System Share
sidebar_label: Share
---

System-level sharing functionality can be triggered via behaviors. Typically, the resource being shared is a URL, but the shared data can also include a title, message, and subject.

Here's an example of a sharing a link to a website, with a message. The system sharing UI will let them send the link and message via email, SMS, or other app installed on their device.

```xml
<view style="Button">
  <behavior
    xmlns:share="https://instawork.com/hyperview-share"
    action="share"
    trigger="press"
    share:url="https://www.instawork.com"
    share:message="Check out this website!"
  />
  <text style="Button__Label">Share link</text>
</view>
```

# Structure

Share attributes and elements require their own namespace:

```html
https://instawork.com/hyperview-share
```

Share behaviors are created using the standard [`<behavior>`](/docs/reference_behavior) element. To trigger a share behavior, just set the `action` attribute to `"share"`. It's usually convenient to define the XML namespace on the `<behavior>` element too:

```xml
<behavior
  xmlns:share="https://instawork.com/hyperview-share"
  trigger="longPress"
  action="alert"
/>
```

Note that any standard trigger can be used, as long as it's supported by the element containing the `<behavior>`.

The shared message and url are defined as namespaced attributes on the `<behavior>` element:

```xml
<behavior
  xmlns:share="https://instawork.com/hyperview-share"
  trigger="longPress"
  action="share"
  share:url="https://www.xkcd.com"
  snare:message="Share website"
/>
```

## Share attributes

The following attributes are part of the `https://instawork.com/hyperview-share` namespace.

### dialog-title

| Type   | Required |
| ------ | -------- |
| string | **No**   |

The title that appears as part of the Share UI on Android devices.

### subject

| Type   | Required |
| ------ | -------- |
| string | **No**   |

If the user chooses to share the content via email, this attribute will pre-populate the subject of the email.

### message

| Type   | Required |
| ------ | -------- |
| string | **No**   |

The message to share. Either `message` or `url` must be provided. If neither is provided, the behavior is a no-op.

### url

| Type   | Required |
| ------ | -------- |
| string | **No**   |

The url to share. Either `message` or `url` must be provided. If neither is provided, the behavior is a no-op.

### title

| Type   | Required |
| ------ | -------- |
| string | **No**   |

The title of the message to share. A title can be included with either `message` or `url`.
