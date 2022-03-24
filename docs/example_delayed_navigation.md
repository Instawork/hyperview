---
id: example_delayed_navigation
title: Delayed navigation
sidebar_label: Delayed navigation
---

The previous example demonstrated the basics of navigation, starting by adding a simple `href` attribute, through customizing the loading screen. The built-in Hyperview navigation actions all work on the principle that the navigation transition (pushed screen or modal) should happen immediately, while the content loads. However, sometimes immediate navigation is not desirable:

- On a screen with a `<form>`, the request may be invalid. In this case, we want to stay on the current screen and update the form with validation errors.
- Sometimes, a request to the "next screen" may need to be interrupted by showing a warning modal (or to request some required user information).

These interaction can be implemented in Hyperview using update actions and the [`load`](/docs/reference_behavior_attributes#load) behavior trigger.

We start with a screen similar to the one in the previous example, with a single link. There are a couple of key differences:

- We've added an empty "redirectContainer" view
- Instead of using the default "push" navigation action, we've specified the "replace" update action to update content on this screen.
- The target of the "replace-inner" action is "redirectContainer", so the fetched content will replace the children of the container view.
- We've added a spinner with id "loadingSpinner" that's hidden by default.
- We also use the `show-during-load` attribute to show a loading spinner on the current screen:

```xml
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
        href="/case_studies/delayed_navigation/redirect.xml"
        action="replace-inner"
        target="redirectContainer"
        show-during-load="loadingSpinner"
      >
        Click me
      </text>
      <spinner hide="true" id="loadingSpinner" />
      <view id="redirectContainer" />
    </body>
  </screen>
</doc>
```

Rather than directly requesting the second screen, we request a document fragment called `redirect.xml`:

```xml
<view
  xmlns="https://hyperview.org/hyperview"
  trigger="load"
  href="/case_studies/delayed_navigation/screen2.xml"
/>
```

This fragment is very simple: it contains a behavior that executes as soon as the fragment is added to the screen. The behavior will perform the default action of "push" to push a new screen on the stack, and load the contents of "screen2.xml".

Putting it all together, we get the desired delayed navigation behavior:

![delayed navigation](/img/example_delayed_navigation1.gif)

<div style="text-align:center;margin-bottom:1em;">
  <a class="button" href="https://github.com/Instawork/hyperview/tree/master/examples/case_studies/delayed_navigation">See the full code</a>
</div>

This technique is very powerful. In this example, we hard-coded the contents of `redirect.xml`. In a real app, the contents could be dynamically generated. For example, instead of always opening the second screen, server-side logic could've decided to open a modal instead. Or, the server could've sent back an error message instead of a behavior that triggers on load. It could also return a success message and a second link, requiring the user to perform a "double confirm" to proceed to the next screen.

This technique is often used with forms to provide server-side validation, or to continue navigation if the form validated:

- The entire body of the screen is wrapped in a `<form>` element with an id.
- The "submit" button in the form has a `target` attribute targetting the entire `<form>` element with the `replace` action.
- If the form is invalid, the entire form will be replaced with a version that shows errors on the appropriate fields.
- If the form is valid, the form may be replaced with a version that shows a success state, plus a behavior that triggers on "load" like in the example above.
