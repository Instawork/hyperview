---
id: example_navigation
title: Navigation
sidebar_label: Navigation
---

To create a navigation that simply pushes a new screen onto the stack, you first need to define the navigation hierarchy which contains the stack.

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <navigator id="root" type="stack">
    <nav-route id="home" href="http://myapp.com/home.xml" />
  </navigator>
</doc>
```

Next, inside the `home.xml`, add an `href` attribute to any `<view>`, `<text>`, or `<image>` element. In the example below, a `<text>` element has an `href` attribute which will push the `screen2.xml` screen onto the stack.

```xml
<!-- home.xml -->
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body" backgroundColor="white" flex="1" padding="48" />
      <style id="Label" fontSize="18" lineHeight="24" />
      <style id="Label--Link" color="blue" fontSize="18" />
    </styles>
    <body style="Body">
      <text style="Label">This is screen 1.</text>
      <text
        style="Label Label--Link"
        href="/case_studies/navigation/screen2.xml"
      >
        Click me
      </text>
    </body>
  </screen>
</doc>
```

The response for `/screen2`:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body" backgroundColor="white" flex="1" padding="48" />
      <style id="Label" fontSize="18" lineHeight="24" />
      <style id="Label--Link" color="blue" fontSize="18" />
    </styles>
    <body style="Body">
      <text style="Label">This is screen 2.</text>
    </body>
  </screen>
</doc>
```

The result:

![navigation 1](/img/example_navigation1.gif)

Notice that Hyperview immediately pushes the new screen onto the stack while requesting the content. Hyperview uses some defaults during the navigation:

- Pressing "Click me" applies an opacity to indicate the link was pressed.
- The new screen shows a spinner to indicate that the screen content is still loading.

We can customize both of these aspects of the navigation.

A [Navigation Guide](https://hyperview.org/docs/guide_navigation) dives deeper into the details including some useful examples and best practices.

## Customized pressed appearance

To control the pressed appearance of the link, we can add a [`<modifier>`](/docs/reference_modifier) element to the `<style>` rule for `Label--Link`. For example, if we want the link to turn red and bold when pressed:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body" backgroundColor="white" flex="1" padding="48" />
      <style id="Label" fontSize="18" lineHeight="24" />
      <style id="Label--Link" color="blue" fontSize="18">
        <modifier pressed="true">
          <style color="red" fontWeight="bold" />
        </modifier>
      </style>
    </styles>
    <body style="Body">
      <text style="Label">This is screen 1.</text>
      <text
        style="Label Label--Link"
        href="/case_studies/navigation/screen2.xml"
      >
        Click me
      </text>
    </body>
  </screen>
</doc>
```

![navigation 3](/img/example_navigation2.gif)

## Customized loading state

To customize the loading screen for the second screen, we need to add a [`show-during-load`](/docs/reference_behavior_attributes#show-during-load) behavior attribute to the link. We also need to add a second (hidden) screen to the first doc to describe the loading screen:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body" backgroundColor="white" flex="1" padding="48" />
      <style id="Label" fontSize="18" lineHeight="24" />
      <style id="Label--Link" color="blue" fontSize="18">
        <modifier pressed="true">
          <style color="red" fontWeight="bold" />
        </modifier>
      </style>
    </styles>
    <body style="Body">
      <text style="Label">This is screen 1.</text>
      <text
        style="Label Label--Link"
        href="/case_studies/navigation/screen2.xml"
        show-during-load="screen2Loading"
      >
        Click me
      </text>
    </body>
  </screen>

  <screen id="screen2Loading">
    <styles>
      <style
        id="Body"
        backgroundColor="white"
        flex="1"
        padding="48"
        alignItems="center"
      />
      <style id="Label" fontSize="18" lineHeight="24" fontWeight="bold" />
      <style id="Spinner" paddingBottom="24" />
    </styles>
    <body style="Body">
      <view style="Spinner">
        <spinner />
      </view>
      <text style="Label">Screen 2 is loading...</text>
    </body>
  </screen>
</doc>
```

![navigation 2](/img/example_navigation3.gif)

Notice that each `<screen>` element defines its own styles. In this case, `screen2Loading` defines the `Label` style as bold. The styles of the two screens defined in one doc do not interact with each other.

## Modal navigation

To make a new screen appear as a modal, simply add `action="new"` to the link:

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body" backgroundColor="white" flex="1" padding="48" />
      <style id="Label" fontSize="18" lineHeight="24" />
      <style id="Label--Link" color="blue" fontSize="18">
        <modifier pressed="true">
          <style color="red" fontWeight="bold" />
        </modifier>
      </style>
    </styles>
    <body style="Body">
      <text style="Label">This is screen 1.</text>
      <text
        style="Label Label--Link"
        href="/case_studies/navigation/screen2.xml"
        action="new"
        show-during-load="screen2Loading"
      >
        Click me
      </text>
    </body>
  </screen>

  <screen id="screen2Loading">
    <styles>
      <style
        id="Body"
        backgroundColor="white"
        flex="1"
        padding="48"
        alignItems="center"
      />
      <style id="Label" fontSize="18" lineHeight="24" fontWeight="bold" />
      <style id="Spinner" paddingBottom="24" />
    </styles>
    <body style="Body">
      <view style="Spinner">
        <spinner />
      </view>
      <text style="Label">Screen 2 is loading...</text>
    </body>
  </screen>
</doc>
```

![navigation 4](/img/example_navigation4.gif)

## Navigating back

To go back to the first screen from the second screen, we can use `back` action. (Note that for a modal, we would use the `close` action):

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body" backgroundColor="white" flex="1" padding="48" />
      <style id="Label" fontSize="18" lineHeight="24" />
      <style id="Label--Link" color="blue" fontSize="18" />
    </styles>
    <body style="Body">
      <text style="Label">This is screen 2.</text>
      <text style="Label Label--Link" action="back" href="#">Go back</text>
    </body>
  </screen>
</doc>
```

![navigation 5](/img/example_navigation5.gif)

Note that when going back to the existing screen, `href` can use the "unspecified" format (`#`). This just tells Hyperview to do the navigation, without trying to load new content. If we wanted to refresh the previous screen or load different content, we could specify the href to do so.
