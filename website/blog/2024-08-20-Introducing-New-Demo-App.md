---
author: Rohan Kumar
authorURL: https://github.com/rohankumar1999
title: Introducing the New Demo App
---

The Hyperview demo app was introduced at the same time as the first public release of Hyperview - its goal has always been to showcase the Hyperview functionality through various examples, but it didn’t receive the same attention as the main Hyperview codebase did, in order to scale properly. In particular, the examples code was made of verbose static XML files, that contained a lot of duplication and style inconsistencies. In order to see the examples in action, developers had to clone the Hyperview repository, install the packages, install the mobile runtime of their choice, and run a local server. All of these issues contributed to a less than ideal user and developer experience.

But thanks to some recent development on this project, we can now overcome all these pain points. It is with great excitement that we announce an overhaul of our Hyperview demo app.

### Reduced Markup, Increased Readability
Using nunjuck’s template inheritance, we abstracted away common markup and styles to focus on the content of the screen.

| Before | After |
| -------- | ------- |
| <img src="/img/markup_before.gif" width="400" /> | <img src="/img/markup_after.png" width="450" /> |

### Introduction of Macros
We make use of macros, another functionality of nunjuck templates, to abstract common styles and markup under reusable functions. They helped us reduce the footprint of the XML code throughout the examples. See the example below for the button XML code:

| Before | After |
| -------- | ------- |
| <img src="/img/macro_before.png" width="400" /> | <img src="/img/macro_after_definition.png" width="700" /> <p style="text-align: center;"> **+** </p>   <img src="/img/macro_after_invocation.png" width="700" /> |

### Flattened Hierarchy to Simplify Navigation
We flattened the navigation hierarchy to make it easier to find examples. Prior to this, developers had to navigate through multiple screens just to land at an example. This was made possible by implementing a tab bar layout, and a segmented control layout inside each tab.

Now you are just a tap or two away from reaching the example you wish to refer to.

| Before | After |
| -------- | ------- |
| <img src="/img/navigation_before.gif" /> | <img src="/img/navigation_after.gif" /> |

### Accessible through your Browser!
A web version of our demo app is just a link away rather than going through the process of installing an application on your phone.

Now save your time by skipping the whole installation process of a mobile app!

Check it out now: Live examples (https://hyperview.org/docs/example_live)

<img src="/img/web_version.png" />

### Surfacing community custom Hyperview components
Hyperview was designed early on to be extensible; although support for custom elements and behaviors was available from early Hyperview versions, it was never clearly surfaced to our users. We now have a dedicated section in the demo app for community-built components, under the “Advanced” tab. We’d love to showcase your custom component in our demo app! Refer to this(https://instawork.atlassian.net/wiki/spaces/EN/pages/3381297336/Demo+App+Contributor+Guide) guide for rules and practices on getting started with contributing to the demo app.
