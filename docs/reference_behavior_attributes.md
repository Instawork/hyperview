---
id: reference_behavior_attributes
title: Behavior Attributes
sidebar_label: Behavior Attributes
---

Behavior attributes are the main way to add interactivity to a Hyperview app. Behavior attributes enable rich interactions with a declarative syntax, powered by server-side logic.

Behaviors are based on a simple hypermedia model:

1. A behavior **executes** when it gets triggered, usually due to user input.
2. At the start of execution, the behavior requests new Hyperview content (XML), either from a remote location (via HTTP request) or locally (from a document fragment)
3. The request completes with Hyperview content (XML).
4. The new Hyperview content (XML) gets shown on the device, either by loading it in a new screen, or by injecting it into the current screen.

The set of **behavior attributes** described in this document give control over the steps outlined above. At a high level, the attributes define:

- [`trigger`](#trigger): What interaction causes the behavior to execute?
- [`href`](#href): What content should get requested?
- [`verb`](#verb): How should the content get requested?
- [`action`](#action): What should the client do with the content?
- [`target`](#target): Where in the app should the client perform the action?

Note: When an `href` attribute is found on an element, Hyperview wraps the element with a "tappable" view. It is possible to customize the styles applied to that wrapping view by specifying the `href-style` property. See [Styles](/docs/reference_style).

The rest of the document describes in-depth how these attributes work together.

## trigger

| Type                                                                                                                       | Required |
| -------------------------------------------------------------------------------------------------------------------------- | -------- |
| **press** (default), longPress, pressIn, pressOut, visible, refresh, load, select, deselect, focus, blur, change, on-event | No       |

### `press`

Triggers on a press-in/press-out combination on the element, uninterrupted by a gesture.

These elements support the `press` trigger:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)

### `longPress`

Triggers on a press and hold without a press-out, uninterraupted by a gesture.

These elements support the `longPress` trigger:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)

### `pressIn`

Triggers immediately when the element is touched.

These elements support the `pressIn` trigger:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)

### `pressOut`

Triggers immediately when a touch is released from an element.

These elements support the `pressOut` trigger:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)

### `visible`

Triggers when the element is visible on the device's display. If the element is visible when the screen loads, the behavior will execute immediately. Otherwise, the action will trigger when the element is scrolled into view.

These elements support the `visible` trigger:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)

### `refresh`

Triggers on a pull-to-refresh gesture.

These elements support the `refresh` trigger:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)
- [`<list>`](/docs/reference_list)
- [`<section-list>`](/docs/reference_sectionlist)

### `load`

Triggers when the element is first loaded in the screen or update fragment.

> Elements with `hide="true"` are not loaded in the screen. This means any hidden element (or child element) with the `load` trigger will not be executed.

These elements support the `load` trigger:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)
- [`<image>`](/docs/reference_image)

### `select`

Triggers when the element is selected. Only works on selectable elements.

These elements support the `select` trigger:

- [`<option>`](/docs/reference_option)

### `deselect`

Triggers when the element is deselected. Only works on selectable elements.

These elements support the `deselect` trigger:

- [`<option>`](/docs/reference_option)

### `focus`

Triggers when the element is focused. Only works on focusable elements.

These elements support the `focus` trigger:

- [`<text-field>`](/docs/reference_textfield)
- [`<text-area>`](/docs/reference_textarea)

### `blur`

Triggers when the element loses focus. Only works on focusable elements.

These elements support the `blur` trigger:

- [`<text-field>`](/docs/reference_textfield)
- [`<text-area>`](/docs/reference_textarea)

### `change`

Triggers when the element value changes. Only works on editable elements.

> **NOTE**: when using the `change` trigger on a `<text-field>` that include the `mask` attribute, the behavior will be triggered even if the mask prevents the pressed key from being set.

> **NOTE**: on a `<text-field>`, the `change` trigger can be paired with the `debounce` attribute, which can be set with the number of milliseconds to debounce change events, i.e. `debounce="200"` will debounce the `change` event to 200ms after the last change on the text field occured.

These elements support the `change` trigger:

- [`<text-field>`](/docs/reference_textfield)
- [`<text-area>`](/docs/reference_textarea)
- [`<switch>`](/docs/reference_switch)

### `on-event`

Triggers when the element captures an event with the specified `event-name`. This trigger requires an `event-name` attribute to be present and may be triggered from any hyperview screen.

These elements support the `on-event` trigger:

- [`<view>`](/docs/reference_view)
- [`<text>`](/docs/reference_text)

The `on-event` trigger may also be combined with [`once`](#once) and [`delay`](#delay).

> **Debugging tip**
>
> In `__DEV__` mode, the console will log the element which captures an event

### `back`

Triggers when the screen is being closed by behavior action (`back` or `close`), or by using a swipe gesture or physical back button (Android). As long as there are any visible behaviors with a `back` trigger, the screen can not be closed.

> **NOTE**: Only works when using internal Navigators. See [navigator](reference_navigator#instantiation).

These elements support the `back` trigger:

- [`<view>`](/docs/reference_view)

### Supported triggers

Not all elements support behavior attributes or `<behavior>` elements. Those that do may not support every trigger. This list below defines which elements can have behaviors, and which triggers they support.

#### `<view>`

[`<view>`](/docs/reference_view) supports behavior attributes (or `<behavior>` elements as direct children) with the following triggers:

- [press](#press)
- [longPress](#longpress)
- [pressIn](#pressin)
- [pressOut](#pressout)
- [visible](#visible)
- [refresh](#refresh)
- [load](#load)
- [on-event](#on-event)
- [back](#back)

#### `<text>`

- [`<text>`](/docs/reference_text) supports behavior attributes (or `<behavior>` elements as direct children) with the following triggers:
  - [press](#press)
  - [longPress](#longpress)
  - [pressIn](#pressin)
  - [pressOut](#pressout)
  - [visible](#visible)
  - [refresh](#refresh)
  - [load](#load)
  - [on-event](#on-event)

#### `<image>`

[`<image>`](/docs/reference_image): supports behavior attributes (or `<behavior>` elements as direct children) with the following triggers:

- [press](#press)
- [longPress](#longpress)
- [pressIn](#pressin)
- [pressOut](#pressout)
- [visible](#visible)
- [refresh](#refresh)
- [load](#load)

#### `<list>`

[`<list>`](/docs/reference_list): supports behavior attributes (or `<behavior>` elements as direct children) with the following triggers:

- [refresh](#refresh)

#### `<section-list>`

- [`<section-list>`](/docs/reference_sectionlist): supports behavior attributes (or `<behavior>` elements as direct children) with the following triggers:
  - [refresh](#refresh)

#### `<option>`

[`<option>`](/docs/reference_option): supports behavior attributes (or `<behavior>` elements as direct children) with the following triggers:

- [select](#select)
- [deselect](#deselect)

#### `<text-field>`

[`<text-field>`](/docs/reference_textfield): supports behavior attributes (or `<behavior>` elements as direct children) with the following triggers:

- [focus](#focus)
- [blur](#blur)

#### `<text-area>`

[`<text-area>`](/docs/reference_textarea): supports behavior attributes (or `<behavior>` elements as direct children) with the following triggers:

- [focus](#focus)
- [blur](#blur)

## href

| Type   | Required |
| ------ | -------- |
| string | **Yes**  |

> The `href` attribute is required for all built-in behaviors. However, custom behaviors may not require an `href`.

The only required attribute to create a behavior, `href` specifies how to retrieve new app content in response to a trigger. There are three accepted formats:

#### Relative URIs

In the "relative URI" format, `href` is a path starting with a `/`. This path is combined with the protocol and host of the request used to fetch the current document to create a URL. When the behavior triggers, new content will be fetched via HTTP from the full URL.

For example, assume the following doc is loaded from `https://mysite.com`:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <text href="/hello/world?param=true">Hello</text>
    </body>
  </screen>
</doc>
```

When the user presses "Hello", content for the next screen will be requested from `https://mysite.com/hello/world?param=true`.

#### Absolute URLs

In the "absolute URL" format, `href` is a full URL, with protocol, host, path, query params, etc. New content will be fetched via HTTP from the URL as-is.

For example, assume the following doc is loaded from `https://mysite.com/home`:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <text href="https://othersite.com/hello/world?param=true">Hello</text>
    </body>
  </screen>
</doc>
```

When the user presses "Hello", content for the next screen will be requested from `https://othersite.com/hello/world?param=true`.

#### Document fragments

In the "document fragment" format, `href` is an element id prepended by a `#`. The id must refer to an element in the current document.

For example, assume the following doc is loaded from `https://mysite.com/home`:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <text href="#hello-content" action="replace">Hello</text>
      <view hide="true">
        <text id="hello-content">Hi there!</text>
      </view>
    </body>
  </screen>
</doc>
```

When the user presses "Hello", the content of the text element will be replaced with the content of the text element identified as `hello-content`:

> When using document fragment hrefs, form data will be ignored, and the `verb` attribute has no meaning.

#### Unspecified

An unspecified `href` looks like "#". This can only be used with `back` and `close` actions, to indicate that the navigation should happen with no fetched href.

## verb

| Type                    | Required |
| ----------------------- | -------- |
| **get** (default), post | No       |

The `verb` attribute defines the HTTP method used to request the content specified by `href`. If not specified, defaults to "get".

- When using `get`, any `<form>` values will be URL-encoded and added to the `href`.
- When using `post`, any `<form>` values will be form-URL encoded (`x-www-form-urlencoded`).
- `verb` only has meaning when making remote requests. If a behavior has a document fragment `href` and a `verb`, the `verb` attribute will be ignored.

## action

| Type                                                                                                                                                                                                                  | Required |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **push** (default), new, back, close, navigate, deep-link, open-settings, replace, replace-inner, append, prepend, reload, dispatch-event, show, hide, toggle, set-value, copy-to-clipboard, select-all, unselect-all | No       |

The `action` attribute defines what to do with the Hyperview XML resource described by the `href` attribute. The possible actions are divided into **navigation actions**, which load or navigate to a screen, and **update actions**, which update the elements on the current screen.

The navigation actions include:

- [`push`](#push)
- [`new`](#new)
- [`back`](#action-back)
- [`close`](#close)
- [`navigate`](#navigate)
- [`reload`](#reload)
- [`deep-link`](#deep-link)
- [`open-settings`](#open-settings)

The update actions include:

- [`replace`](#replace)
- [`replace-inner`](#replace-inner)
- [`append`](#append)
- [`prepend`](#prepend)
- [`dispatch-event`](#dispatch-event)
- [`show`](#show)
- [`hide`](#hide)
- [`toggle`](#toggle)
- [`set-value`](#set-value)
- [`copy-to-clipboard`](#copy-to-clipboard)
- [`select-all`](#select-all)
- [`unselect-all`](#unselect-all)

### `push`

The `push` navigation action will push a new screen onto the stack, and the fetched content will be displayed in the new screen.

When using `push`, the fetched content must be either a full Hyperview XML document (with `<doc>` root), or a `<screen>` element from the current screen's document.

If the element triggering the push is a [`<form>`](/docs/reference_form) or contained in a `<form>` element, the form's data will be serialized as query parameters and included in the request. The form data has no effect when the href refers to a local `<screen>` element.

### `new`

The `new` navigation action will open a new screen on top of the current screen, and the fetched content will be displayed in the new screen.

When using `new`, the fetched content must be either a full Hyperview XML document (with `<doc>` root), or a `<screen>` element from the current screen's document.

If the element triggering the modal is a [`<form>`](/docs/reference_form) or contained in a `<form>` element, the form's data will be serialized as query parameters and included in the request. The form data has no effect when the href refers to a local `<screen>` element.

<a id="action-back"></a>

### `back`

The `back` navigation action will undo a `push`, by popping the current screen off the stack and revealing the previous screen on the stack.

If the provided `href` attribute would load data from the same source as the previous screen, no request happens. However, if the provided `href` is different, a request will be made to reload the previous screen.

For example, take this document for the first screen in an app, loaded from `https://mystie.com/first`:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <text href="/second" action="push">Go to second screen</text>
    </body>
  </screen>
</doc>
```

And the second screen:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <text href="/first" action="back">Go back</text>
      <text href="/third" action="back">Go back to a different place</text>
    </body>
  </screen>
</doc>
```

When the user presses "Go to second screen", the second screen will be pushed onto the stack. Then, if the user pushes "Go back", the stack will unwind, and the user will see screen 1 again. However, if the user pushes "Go back to a different place", the stack will unwind, and Hyperview will make a request to `https://mysite.com/third`. The content of the first screen will be replaced with the content from the third request.

> Any change in the URL will cause a reload, including changes in the search string.

> Use `href="#"` to navigate back to the previous screen without reloading or knowing the URL.

If the element triggering the back navigation is a [`<form>`](/docs/reference_form) or contained in a `<form>` element, the form's data will be serialized as query parameters and included in the request. The form data has no effect when the href refers to a local `<screen>` element.

### `close`

The `close` navigation action will undo a `new`, by closing the current modal screen and revealing the previous screen on the stack.

If the provided `href` attribute would load data from the same source as the previous screen, no request happens. However, if the provided `href` is different, a request will be made to reload the previous screen.

For example, take this document for the first screen in an app, loaded from `https://mystie.com/first`:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <text href="/second" action="new">Go to second screen</text>
    </body>
  </screen>
</doc>
```

And the second screen:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <text href="/first" action="close">Go back</text>
      <text href="/third" action="close">Go back to a different place</text>
    </body>
  </screen>
</doc>
```

When the user presses "Go to second screen", the second screen will be opened on top of the first screen. Then, if the user pushes "Go back", the modal screen will close, and the user will see the first screen again. However, if the user pushes "Go back to a different place", the modal will close, and Hyperview will make a request to `https://mysite.com/third`. The content of the first screen will be replaced with the content from the third request.

> Any change in the URL will cause a reload, including changes in the search string.

> Use `href="#"` to close the modal without reloading or knowing the URL of the previous screen.

If the element triggering the close navigation is a [`<form>`](/docs/reference_form) or contained in a `<form>` element, the form's data will be serialized as query parameters and included in the request. The form data has no effect when the href refers to a local `<screen>` element.

### `navigate`

The `navigate` navigation action will either push a screen onto the stack, or unwind the stack to a screen loaded from the given URL.

### `reload`

The `reload` navigation action will re-request the current screen. This is similar to a reload button in a web browser.

If the reload behavior contains an `href`, the given `href` will be used to request the new content for the current screen.

### `deep-link`

The `deep-link` navigation action delegates the navigation to the operating system, in order to decide which app should open the given URL.

### `open-settings`

The `open-settings` navigation action opens the app settings in the OS Settings app.

### `replace`

The `replace` update action will replace the target element on the current screen with the fetched content. By default, the target element is the element that triggered the behavior execution, although that can be controlled with the [`target`](#target) attribute.

When using `replace`, the fetched content must be a document fragment, ie not a `<doc>` or `<screen>` but a `<view>`, `<text>`, etc.

### `replace-inner`

The `replace-inner` update action will replace the children of the target element on the current screen with the fetched content. By default, the target element is the element that triggered the behavior execution, although that can be controlled with the [`target`](#target) attribute.

When using `replace-inner`, the fetched content must be a document fragment, ie not a `<doc>` or `<screen>` but a `<view>`, `<text>`, etc.

### `append`

The `append` update action will add the fetched content as the last child of the target element on the current screen. By default, the target element is the element that triggered the behavior execution, although that can be controlled with the [`target`](#target) attribute.

When using `append`, the fetched content must be a document fragment, ie not a `<doc>` or `<screen>` but a `<view>`, `<text>`, etc.

### `prepend`

The `prepend` update action will add the fetched content as the first child of the target element on the current screen. By default, the target element is the element that triggered the behavior execution, although that can be controlled with the [`target`](#target) attribute.

When using `append`, the fetched content must be a document fragment, ie not a `<doc>` or `<screen>` but a `<view>`, `<text>`, etc.

### `dispatch-event`

The `dispatch-event` action fires an event specified with the `event-name` attribute on the element. The element must have an `event-name` attribute. A matching event (having same `event-name`) will then trigger [`on-event`](#on-event) behavior on any hyperview screen(s).

The `dispatch-event` action may also be combined with [`once`](#once) and [`delay`](#delay).

> **Debugging tip**
>
> In `__DEV__` mode, the console will log the element which dispatches an event

### `show`

The `show` action will show the target element if the target is currently hidden (with `hide="true"`). If the target is not hidden, this action will have no effect. This action can be used in conjunction with [`delay`](#delay) to show the element after the given number of milliseconds. When using `delay`, you can also specify [`show-during-load`](#show-during-load) and [`hide-during-load`](#hide-during-load) attributes to show and hide indicators during the delay.

```xml
<view action="show" style="Button" target="show-content">
  <text style="Button__Label">Show</text>
</view>
<text id="show-content" hide="true">Content to be shown</text>
```

In this example, pressing "Show" will show the text below. See [the repo](https://github.com/Instawork/hyperview/blob/master/examples/behaviors/show.xml) for more examples.

### `hide`

The `hide` action will hide the target element by applying `hide="true"` to the target. If the target is already hidden, this action will have no effect. This action can be used in conjunction with [`delay`](#delay) to hide the element after the given number of milliseconds. When using `delay`, you can also specify [`show-during-load`](#show-during-load) and [`hide-during-load`](#hide-during-load) attributes to show and hide indicators during the delay.

```xml
<view action="hide" style="Button" target="hide-content">
  <text style="Button__Label">Hide</text>
</view>
<text id="hide-content">Content to be hidden</text>
```

In this example, pressing "Hide" will hide the text below. See [the repo](https://github.com/Instawork/hyperview/blob/master/examples/behaviors/hide.xml) for more examples.

### `toggle`

The `toggle` action will toggle the visibility of the target element by applying or removing `hide="true"`. If the target is already hidden, this action will show it. If the target is not hidden, this action will hide it. This action can be used in conjunction with [`delay`](#delay) to toggle the element after the given number of milliseconds. When using `delay`, you can also specify [`show-during-load`](#show-during-load) and [`hide-during-load`](#hide-during-load) attributes to show and hide indicators during the delay.

```xml
<view action="toggle" style="Button" target="toggle-content">
  <text style="Button__Label">Hide</text>
</view>
<text id="toggle-content">Content to be toggled</text>
```

In this example, pressing "Toggle" will toggle the text below. See [the repo](https://github.com/Instawork/hyperview/blob/master/examples/behaviors/toggle.xml) for more examples.

### `set-value`

The `set-value` action allows setting the input value of the target element. The behavior attributes must include a [`new-value`](#new-value) attribute specifying the new value.

Note that the target element must only be one of the following elements:

- [`<text-field>`](/docs/reference_textfield)
- [`<text-area>`](/docs/reference_textarea)
- [`<picker-field>`](/docs/reference_pickerfield)
- [`<date-field>`](/docs/reference_datefield)
- [`<select-single>`](/docs/reference_selectsingle)
- [`<switch>`](/docs/reference_switch)

Notable, `<select-multiple>` is not currently supported. Also note that using `set-value` will ignore any validation or restrictions set by the input element, like masks or other requirements.

```xml
<text-field id="id_tf" />
<text style="link" action="set-value" new-value="Test" target="id_tf">Set</text>
<text style="link" action="set-value" new-value="" target="id_tf">Clear value</text>
```

In this example, pressing "Set" will fill in the text field with "Test". Pressing "Clear value" will fill in the text field with "".
See [the repo](https://github.com/Instawork/hyperview/blob/master/examples/advanced_behaviors/set_value/index.xml) for more examples.

### `copy-to-clipboard`

The `copy-to-clipboard` action allows copying a value to the clipboard. The behavior attributes must include a [`copy-to-clipboard-value`] attribute specifying the value to be copied.

```xml
<view>
  <behavior
    trigger="press"
    action="copy-to-clipboard"
    copy-to-clipboard-value="Hello World!"
  />
  <text style="link">Copy to clipboard</text>
</view>
```

In this example, pressing "Copy to clipboard" will copy the value "Hello World!" to the clipboard.
See [the repo](https://github.com/Instawork/hyperview/blob/master/examples/advanced_behaviors/copy_to_clipboard/index.xml) for examples.

### `select-all`

The `select-all` action allows selecting all the options of the target element.

Note that the target element must be a [`<select-multiple>`](/docs/reference_selectmultiple) element.

```xml
<select-multiple id="id_sm">
    <option value="1">
      <text>1st option</text>
    </option>
    <option value="2">
      <text>2nd option</text>
    </option>
    <option value="3" selected="true">
      <text>3rd option</text>
    </option>
</select-multiple>
<text style="link" action="select-all" target="id_sm">Select all</text>
```

In this example, pressing "Select all" will select "1st option" and "2nd option", in addition to the already selected "3rd option".
See [the repo](https://github.com/Instawork/hyperview/blob/master/examples/behaviors/select_all/index.xml) for more examples.

### `unselect-all`

The `unselect-all` action allows unselecting all the options of the target element.

Note that the target element must only be one of the following elements:

- [`<select-single>`](/docs/reference_selectsingle)
- [`<select-multiple>`](/docs/reference_selectmultiple)

```xml
<select-multiple id="id_sm">
    <option value="1" selected="true">
      <text>1st option</text>
    </option>
    <option value="2" selected="true">
      <text>2nd option</text>
    </option>
    <option value="3">
      <text>3rd option</text>
    </option>
</select-multiple>
<text style="link" action="unselect-all" target="id_sm">Unselect all</text>
```

In this example, pressing "Unselect all" will unselect "1st option" and "2nd option", that were initially selected.
See [the repo](https://github.com/Instawork/hyperview/blob/master/examples/behaviors/unselect_all/index.xml) for more examples.

## target

| Type   | Required |
| ------ | -------- |
| string | No       |

This attribute specifies the target of the action. The meaning depends on the action type.

#### Navigation actions

For navigation actions, `target` refers to the section of the app's navigation stack that should be used to show the new screen or modal. For example, if an app implements a tab navigation, `target="tab2"` would indicate that the new screen should be pushed in `tab2`. If the current screen was in a different tab, the app would first switch to `tab2`, and then push the new screen.

- If `target` cannot be interpreted by the app, or the app has no navigation targets, setting this attribute will have no effect.

#### Update actions

For update actions, `target` should be the id of an element on the current screen.

- If the target element exists on screen, the update action (`replace`, `append`, etc) will be applied to the specified element rather than the source of the behavior.
- If the id doesn't point to an element on the screen, the action will be a no-op.
- If "target" is unset, the target of the update action will be the source of the behavior.

## show-during-load

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of element ids. The elements with the given ids will be shown while requesting the content identified by `href`. Most commonly used to implement a loading state. The behavior differs a bit depending on the `action` type.

#### Navigation actions

Navigation actions immediately show a new screen or modal before requesting the new content. Since the request can take a while, using `show-during-load` will copy the referenced element into the new screen. Once the request completes, the requested content will replace the loading state on the new screen. There are a few nuances when using this attribute with navigation actions:

- `show-during-load` should only contain a single element id for a `<screen>` element. This screen must be part of the current doc.
- If `show-during-load` contains multiple space-separated element ids, only the first element will be used.
- If the element id from `show-during-load` references an element other than a `<screen>`, that element will not be used as the new screen's loading state.

> Only the first `<screen>` element in `<doc>` will be displayed on a screen. Therefore, be sure to include indicator `<screen>` elements at the end of the `<doc>`.

> When using `action="back"` or `action="navigate"`, the existing screen will be reloaded if the `href` attribute differs from the `href` used to request the content originally. During the request, we can show a loading screen using `show-during-load`.

See also [Loading Screen](/docs/reference_loading_screen) for more information on customizing loading screens.

#### Update actions

During update actions, the elements referenced in `show-during-load` will be shown on the current screen. The indicator elements is hidden after the href is fetched. This is a no-op for elements which don't exist on the screen.

- If `show-during-load` refers to an element ids not present in the screen, the attribute will have no effect.
- If the indicator element itself has behavior attributes with `trigger="load"`, that behavior will trigger when the element appears when the request starts.

> To avoid having the indicator elements visible when the screen first loads, make sure to add `hide="true"` to the indicator elements.

## hide-during-load

| Type   | Required |
| ------ | -------- |
| string | No       |

A space-separated list of element ids. The elements with the given ids will be hidden while requesting the content identified by `href`. The behavior differs a bit depending on the `action` type.

#### Navigation actions

Navigation actions immediately show a new screen or modal before requesting the new content. Since the old screen is not visible during the request, `hide-during-load` will have no effect during navigation actions.

#### Update actions

During update actions, the elements referenced by `hide-during-load` will be hidden on the current screen during the request. When the request completes, the items will be shown again. A couple of nuances:

- If `hide-during-load` refers to element ids not present in the screen, the attribute will have no effect.
- It is possible that the update action will remove the hidden element. For example, `action="replace"` may replace the parent element of the hidden element. In this case, the element will not be shown once the request completes.
- If the indicator element itself has behavior attributes with `trigger="load"`, that behavior will execute when the element re-appears once the request completes.

## delay

| Type   | Required |
| ------ | -------- |
| number | No       |

`delay` specifies the number of milliseconds to wait before requesting the content identified by `href`. Any indicators specified by `show-during-load` or `hide-during-load` will be toggled during the delay. If unset, the content will be requested immediately.

This attribute is used commonly in examples to demonstrate loading states. It can be useful to introduce some artificial delay so that users register that content is being loaded.

## once

| Type                      | Required |
| ------------------------- | -------- |
| true, **false** (default) | No       |

`once="true"` specifies that the behavior should only execute the first time it triggers. If not provided, the default is to execute the behavior on each trigger . This attribute is often used in conjunction with the "visible" trigger, so that we only execute the behavior the first time an element scrolls into view.

## new-value

| Type   | Required                                              |
| ------ | ----------------------------------------------------- |
| string | Required when `action="set-value"`, otherwise ignored |

When the behavior action is [`set-value`](#set-value), this attribute defines the value that will be set on the target input element.
