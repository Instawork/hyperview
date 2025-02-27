---
id: reference_form
title: <form>
sidebar_label: <form>
---

The `<form>` element represents a group of input elements that should be serialized into the request. Any behaviors within the `<form>` that result in a remote request will include the form's input values. This applies to both update and navigation actions.

The encoding of the input values depend on the request method:

- For **POST** requests, the body will be encoded as `multipart/form-data`.
- For **GET** requests, the input values will be added as query parameters.

```xml
<screen>
  <form id="feedbackForm">
    <text-field
      name="email"
      keyboard-type="email-address"
      placeholder="Email"
      value="bob@example.com"
    />

    <text-field
      multiline="true"
      name="feedback"
      placeholder="Please leave your feedback"
      value="Great work!"
    />

    <text verb="post" href="/feedback" action="replace" target="feedbackForm">
      Submit
    </text>
  </form>
</screen>
```

In the example above, when the user presses the "Submit" label, Hyperview will make the following request (with headers and body):

```
POST /feedback

X-Hyperview-Version: 0.4
Content-Type: multipart/form-data; boundary=123
Content-Length: 400

--123
Content-Disposition: form-data; name="email"

bob@example.com
--123
Content-Disposition: form-data; name="feedback"

Great work!
```

## Structure

A `<form>` element can appear anywhere within a `<screen>` element. It can contain any type of element, but it should contain some input elements to serve as a grouping.

## Attributes

- [`style`](#style)
- [`id`](#id)
- [`hide`](#hide)
- [`scroll`](#scroll)
- [`scroll-orientation`](#scroll-orientation)
- [`shows-scroll-indicator`](#shows-scroll-indicator)

#### `style`

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of styles to apply to the element. See [Styles](/docs/reference_style). Note that text style rules cannot be applied to a `<form>`.

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

#### `scroll`

| Type                      | Required |
| ------------------------- | -------- |
| true, **false** (default) | No       |

An attribute indicating whether the content in the can be scrollable. The style rules of the body will determine the viewport size.

#### `scroll-orientation`

| Type                               | Required |
| ---------------------------------- | -------- |
| **vertical** (default), horizontal | No       |

An attribute indicating the direction in which the body will scroll.

#### `shows-scroll-indicator`

| Type                      | Required |
| ------------------------- | -------- |
| **true** (default), false | No       |

An attribute indicating whether the scroll bar should be shown. Attribute `scroll` should be set in for this to have any effect.
