---
id: example_lazy_load
title: Lazy load
sidebar_label: Lazy load
---

The [previous example](/docs/example_infinite_scroll) showed how to implement an infinitely-scrolling list in Hyperview. The same technique can be applied to lazily load any section of a screen. This technique can speed up the initial screen load time by delaying the rendering of more computationally-intensive components.

![lazy load](/img/example_lazy_load1.gif)

<div style="text-align:center;margin-bottom:1em;">
  <a class="button" href="https://github.com/Instawork/hyperview/tree/master/demo/backend/advanced/case-studies/lazy-load">See the full code</a>
</div>

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body" backgroundColor="white" flex="1" paddingTop="48" />
      <style
        id="Section1"
        height="640"
        backgroundColor="#4778FF"
        flex="1"
        padding="48"
      />
      <style
        id="Section2"
        height="640"
        backgroundColor="#63CB76"
        flex="1"
        padding="48"
      />
      <style
        id="Section3"
        height="640"
        backgroundColor="#C56BFF"
        flex="1"
        padding="48"
      />
      <style
        id="Label"
        color="white"
        textAlign="center"
        fontSize="48"
        fontWeight="bold"
      />
      <style
        id="Content"
        marginTop="32"
        textAlign="center"
        color="white"
        fontSize="18"
        fontWeight="normal"
      />
    </styles>
    <body style="Body" scroll="true">
      <view style="Section1">
        <text style="Label">Section 1</text>
        <text
          style="Content"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</text>
      </view>
      <view
        style="Section2"
        trigger="visible"
        once="true"
        href="/case_studies/lazy_load/section2.xml"
        action="replace"
      >
        <spinner color="white" />
        <text style="Content">Loading...</text>
      </view>
      <view
        style="Section3"
        trigger="visible"
        once="true"
        href="/case_studies/lazy_load/section3.xml"
        action="replace"
      >
        <spinner color="white" />
        <text style="Content">Loading...</text>
      </view>
    </body>
  </screen>
</doc>
```

The content of section 2 will initially render in a loading state. This section contains a few behavior attributes:

- `trigger="visible"`: the behavior will trigger when the section appears on screen.
- `once="true"`: The behavior will only trigger the first time the section appears on screen (to prevent duplicate triggers if the user scrolls up and down quickly)
- `href="/case_studies/lazy_load/section2.xml`: The behavior will make a remote request to a server to get the content of the second section.
- `action="replace"`: The XML in the response will replace the current markup for the loading state of section 2.

The response for `/case_studies/lazy_load/section2.xml` no longer includes the behavior attributes, and replaces the spinner with actual content:

```xml
<view style="Section2">
  <text style="Label">Section 2</text>
  <text
    style="Content"
  >Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</text>
</view>
```

The third section is implemented in the same way.

In the example above, we assume that the section should only load once visible on the screen. In some cases, we may want to request the section as soon as the screen loads. To achieve this, all we need to do is replace `trigger="visible"` with `trigger="load"`:

```xml
<view
  style="Section"
  trigger="load"
  once="true"
  href="/case_studies/lazy_load/section2.xml"
  action="replace"
>
  <spinner color="white" />
  <text style="Content">Loading...</text>
</view>
```

Now, the behavior will trigger as soon as the screen render, even if the section is not visible:
![lazy load](/img/example_lazy_load2.gif)
