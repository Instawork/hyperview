---
id: reference_styles
title: "<styles>"
sidebar_label: "<styles>"
---

The `<styles>` element contains elements defining the visual appearance of elements in a screen.

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
A `<styles>` element should only appear as a direct child of a `<screen>` element. There should be only one `<styles>` child element per screen.

## Attributes
The `<styles>` element accepts no attributes, since its purpose is to group [`<style>`](/docs/reference_style) elements.
