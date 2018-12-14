---
id: guide_introduction
title: "Introduction"
sidebar_label: "Introduction"
---

### The state of mobile development
At [Instawork](https://instawork.com), we observed a marked difference in developer productivity between our mobile and web platforms.

On *mobile*:
- we released code once a week,
- it took 2 weeks for 80% of our users to get the update,
- developer productivity was slowed down by the need to work across backend and frontend codebases.

On *the web*:
- we could release updates to our app many times a day,
- all of our users always saw our updates immediately,
- developers could build new features quickly by working in a single codebase.

Why was the developer experience so much better on web than on mobile? We realized that it came down to the popular client-server paradigm on each platform:

- On mobile, the dominant paradigm for both iOS and Android is the **thick client** (custom code shipped and executed on the device).
- On the web, the dominant paradigm is the **thin client**.

In fact, the web may be the best-known and most successful example of a thin client platform. Rather than downloading a separate app from each company or developer, users access an endless number of apps via a web browser. The web browser is a thin client because it has no custom logic to handle each website or web app. Instead, it supports rendering a hypermedia format (HTML) that describes the content and interactions users can perform on a page.

The thin client approach on the web allows developers to fully define their app on the server. This brings with it all of the advantages we noted above: the ability to update the app instantly, no need to juggle multiple app versions, and code that's contained on the backend.

So if the thin client paradigm empowered us on the web, why couldn't we use it to develop our mobile apps?

We toyed with using web technologies to develop our mobile apps, but we hit limits since HTML wasn't designed to express mobile UIs. It required hacks and extensions using JavaScript to replicate common interactions. This slowed down development and resulted in a sub-par experience.

Instead, we decided to create a new thin client and a new hypermedia format, designed for writing native mobile apps, without the baggage of HTML.

### Introducing Hyperview

Hyperview is our open-source project to bring the benefits of thin-client, HATEOAS development to native mobile apps. The project consists of two parts:

- **Hyperview XML (HXML)** is an XML-based format to describe native mobile UIs. It supports common UI elements like headers, scroll views, lists, text field, and much more. It also supports styling and a behavior syntax for describing user interactions (touches, gestures, input interaction) without the need for scripting.
- **Hyperview Client** is a cross-platform library for rendering HXML in mobile apps. Implemented in React Native, it can be embedded in existing apps, or you can use it to create a new app from scratch.

In other words:

> On the web, we have **HTML** and **web browsers**.
>
> On mobile we have **HXML** and the **Hyperview Client**.

Instawork uses Hyperview in our production apps to get all of the benefits of the thin-client paradigm in a mobile world:
- We can update out mobile apps many times a day by deploying our backend
- All of our users get our updates immediately without needing to download a new binary
- Developers can be super-productive by building the backend and frontend simultaneously in one codebase

Hyperview has been a total game-changer for how we work at Instawork. The improvements to our developer productivity have allowed us to ship new features more quickly, improve our app's performance, and minimize context switching between mobile and web development. For fast-changing networked mobile apps, Hyperview offers an unbeatable set of tradeoffs.

### Getting started
There are many ways to gets started with Hyperview:

- If you want to learn Hyperview by reading example code, head over to the [Examples](/docs/example_index) section.

- To get a full sense of the elements and behaviors available in Hyperview, check out the full [HXML Reference](/docs/reference_index).

- If you're coming from a web/HTML background, you may want to start with our guide highlighting some of the differences between [HTML and HXML](/docs/guide_html).

- Or, to run a demo yourself, check out our [Getting started](/docs/guide_installation) guide on the next page!
