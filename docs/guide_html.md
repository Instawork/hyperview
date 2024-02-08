---
id: guide_html
title: HXML vs HTML
sidebar_label: HXML vs HTML
---

Hyperview XML (HXML) is an XML-based format used to describe the layout of mobile apps. It draws inspiration from HTML, but differs in a few key ways. This guide describes some of the important differences to help the transition from writing HTML to writing HXML.

## Structure

### XML

HTML does not need to be well-formed according to the XML standard.
HXML follows strict XML formatting rules. All core HXML elements belong to the namespace `https://hyperview.org/hyperview`.

### Top-level docs

In HTML, the `<html>` element defines one web page.

```html
<html>
  <body>
    Hello
  </body>
</html>
```

In HXML, the [`<doc>`](/docs/reference_doc) element can define multiple app screens.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <body>
      <text>Hello</text>
    </body>
  </screen>

  <screen id="otherScreen">
    <body>
      <text>Hello again</text>
    </body>
  </screen>
</doc>
```

### Basic elements

In HTML, `<div>` is the basic container element.

In HXML, [`<view>`](/docs/reference_view) is the basic container element.

### Text content

In HTML, text content can appear in any element:

```html
<div>Hello!</div>
```

In HXML, text content can only appear in `<text>` elements:

```xml
<view>
  <text>Hello!</text>
</view>
```

### Form inputs

In HTML, the `<input>` element has a `type` attribute that's used to render the element as a checkbox or radio input. The use of a shared `name` attribute determines the behavior of a group of inputs (whether one or multiple can be selected).

In HXML, two parent elements called [`<select-single>`](/docs/reference_selectsingle) and [`<select-multiple>`](/docs/reference_selectmultiple) take several [`<option>`](/docs/reference_option) elements. The outer element determines whether one or many options can be selected. The [`<option>`](/docs/reference_option) element has no default styling, and can be customized to look like a checkbox, button, or anything else.

## References & behaviors

### href

In HTML, the `href` can only appear on `<a>` elements.

```html
<a href="/page2">Hello</a>
```

In HXML, the [`href`](/docs/reference_behavior_attributes#href) attribute can appear on most UI elements, including [`<view>`](/docs/reference_view), [`<image>`](/docs/reference_image), [`<text>`](/docs/reference_text), [`<item>`](/docs/reference_image), etc.

```xml
<view href="/page2">
  <text>Hello</text>
</view>
```

In HTML, the [`href`](/docs/reference_behavior_attributes#href) can be a relative URI or absolute URL.
In HXML, the [`href`](/docs/reference_behavior_attributes#href) attribute can additionally refer to any element id in the current [`<doc>`](/docs/reference_doc).

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <body>
      <text href="#otherScreen">Hello</text>
    </body>
  </screen>

  <screen id="otherScreen">
    <body>
      <text>Hello again</text>
    </body>
  </screen>
</doc>
```

### action

In HTML, clicking on an anchor element will always open the href in a new page.
In HXML, elements with an [`href`](/docs/reference_behavior_attributes#href) can also specify an [`action`](/docs/reference_behavior_attributes#action) attribute. Some actions will open new screens, but other actions will modify the current screen by replacing/injecting the response content into the screen's XML.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <body id="Body">
      <text href="/page2">Push a new screen</text>
      <text href="/page2" action="new">Open a new screen as a modal</text>
      <text
        href="/fragment"
        action="replace"
      >Replace this element with the response content</text>
      <text
        href="/fragment"
        action="append"
      >Append the response content to this screen</text>
    </body>
  </screen>
</doc>
```

### target

In HTML, the `target` attribute on an `<a>` element can be used to determine if the href opens in a new window or the same window.

In HXML, the [`target`](/docs/reference_behavior_attributes#target) attribute is an element id referencing an element on the screen. It's used with the [`action`](/docs/reference_behavior_attributes#action) attribute to determine which element should be affected by the action.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <body id="Body">
      <text
        href="/fragment"
        action="append"
        target="list"
      >Append the response content to the list element</text>
      <view id="list">
      </view>
    </body>
  </screen>
</doc>
```

### trigger

In HTML, `<a>` elements will only be triggered by a click on the anchor element.
In HXML, elements with an `href` attribute can have all kinds of triggers, including different types of presses, on item visibility, or on element load.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <body id="Body">
      <text href="/page2">Trigger on press</text>
      <text href="/page2" trigger="longPress">Trigger on long press</text>
      <text
        href="/page2"
        trigger="visible"
      >Trigger when element is visible on screen</text>
      <text href="/page2" trigger="load">Trigger when the screen loads</text>
    </body>
  </screen>
</doc>
```

### Multiple behaviors

In HTML, `<a>` elements can only open one page, and they cannot be nested.
In HXML, an element can specify multiple behaviors using the [`<behavior>`](/docs/reference_behavior) element.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen id="main">
    <body id="Body">
      <text href="/page2">
        <behavior href="/page3" trigger="press" />
        <behavior href="/page2" trigger="longPress" />
        <behavior href="/page4" trigger="refresh" />
        Many things can happen!
      </text>
    </body>
  </screen>
</doc>
```

## Styling

### Style language

- HTML elements are styled using CSS.

```html
<style>
  h1.header {
    font-size: 16px;
    color: red;
  }
</style>
```

- HXML does not use CSS. Instead, it uses the [`<styles>`](/docs/reference_styles) tag to define a group of styles, and [`<style>`](/docs/reference_style) to define a specific set of rules.

```xml
<styles>
  <style id="Header" fontSize="16" color="red" />
</styles>
```

### Selectors

In CSS, selectors can be used to target tags, element ids, classes, or more advanced targets.

```html
<style>
  #main .container h2 {
    color: blue;
  }
</style>
<div id="main">
  <div class="container"><h2>Hello</h2></div>
</div>
```

In HXML, style rules are identified by id. Selection can only happen by id.

```xml
<styles>
  <style id="MainHeader" color="blue" />
</styles>
<body>
  <view>
    <text style="MainHeader">Hello</text>
  </view>
</body>
```

### Applying styles

In CSS, an element can have several styles applied to it by matching multiple selectors. There is a complex hierarchy that determines the order of application of the rules.

```html
<style>
  #main {
    font-size: 12p;
    xcolor: red;
  }
  h2 {
    font-size: 16px;
    color: black;
  }
  .container {
    text-align: center;
  }
  #main .container h2 {
    color: blue;
  }
</style>
<div id="main">
  <div class="container"><h2>Hello</h2></div>
</div>
```

In HXML, an element can explicitly reference several style ids. The application of the style rules matches the order of the ids.

```xml
<styles>
  <style id="Center" color="black" textAlign="center" />
  <style id="H2" fontSize="16" />
  <style id="MainHeader" color="blue" />
</styles>
<body>
  <view>
    <text style="H2 Center MainHeader">Hello</text>
  </view>
</body>
```

### Cascading rules

In CSS, rules cascade to child elements.

```html
<style>
  #main {
    color: red;
  }
</style>
<div id="main">
  <div class="container"><h2>This will be red</h2></div>
</div>
```

In HXML, rules only apply to the element.

```xml
<styles>
  <style id="Main" color="red" />
</styles>
<body style="main">
  <view>
    <text>This will not be red</text>
  </view>
</body>
```

### Modifiers

In CSS, the styles for different states are defined using pseudo-selectors:

```html
<style>
  a {
    color: blue;
  }
  a:hover {
    color: red;
  }
</style>
```

In HXML, the styles for different states are defined using the [`<modifier>`](/docs/reference_modifier) element:

```xml
<style id="Link" color="blue">
  <modifier pressed="true">
    <style color="red" />
  </modifier>
</style>
```

In CSS, pseudo-selector states are local to that element, but can affect other elements through the selector.

```html
<style>
  a {
    color: blue;
  }
  a:hover {
    color: red;
  }
  a:hover span {
    color: green;
  }
</style>
<body>
  <a href="#">Hello, <span>world</span>!</a>
</body>
```

In HXML, the modifier state applies to all child elements:

```xml
<styles>
  <style id="Link" color="blue">
    <modifier pressed="true">
      <style color="red" />
    </modifier>
  </style>
  <style id="Span" color="blue">
    <modifier pressed="true">
      <style color="green" />
    </modifier>
  </style>
</styles>
<body>
  <text style="Link">
    Hello,
    <text style="Span">
      World!
    </text>
  </text>
</body>
```
