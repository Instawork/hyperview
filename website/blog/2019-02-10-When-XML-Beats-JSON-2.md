---
author: Adam Stepinski
authorURL: https://github.com/adamstep
title: When XML beats JSON: Extensibility
---

In [Part 1](/blog/2019/01/16/When-XML-Beats-JSON-1) of this series of blog posts, we explored the relative strengths and weaknesses of JSON and XML when representing various data structures. For key-value based data, JSON is the clear winner. But XML beats JSON when it comes to representing tree structures. Since UI layouts are commonly represented as trees, XML is the natural choice for a UI framework like Hyperview.

Another imporant consideration for Hyperview was extensibility. Extensibility matters for a couple of reasons:
- We want to keep the core UI elements limited to the bare essentials. But we don't want the framework to be limited to *only* those core elements. We wouldn't include a map UI element in the core, but it should be possible for developers to add a customed map element to their Hyperview app.
- Developers should have the freedom to integrate with services or technologies they already use. Some developers may use Mixpanel for tracking UI events, others may use Amplitude or an in-house system. Hyperview should remain agnostic and support all of these cases.

### What's the X for?
XML stands for [Extensible Markup Language](https://en.wikipedia.org/wiki/XML), so it should come as no surprise that extensibility is built into the lowest level of the spec. The extensibility of XML is based on the idea of using multiple XML "vocabularies" within one XML document. A vocabulary is simply a collection of tags and attributes with a specific meaning. Vocabularies can be formalized with a [schema definition](https://en.wikipedia.org/wiki/XML_Schema_(W3C)) and embedded into XML documents via [namespaces](https://en.wikipedia.org/wiki/XML_namespace).

To illustrate how we can embed different vocabularies in the same XML document, let's use the map example from above. Hyperview doesn't come with a way to describe a map, but we can define our own vocabulary:

- `<map>` will represent a specific instance of a map. It takes a few attributes:
  - `latitude`: the latitude of the upper left corner of the map
  - `longitude`: the longitude of the upper left corner of the map
  - `latitude-delta`: the latitudinal length covered by the map
  - `longitude-delta`: the longitudinal length covered by the map
- `<marker>` will represent a indicator marker placed on the map. The attributes:
  - `latitude`: the latitude of the marker
  - `longitude`: the longitude of the marker

Using this new vocabulary, we can describe a map containing two markers:
```
<map latitude="37.65" longitude="-122.50" latitude-delta="0.1" longitude-delta="0.05">
  <marker latitude="37.65" longitude="-122.46"/>
  <marker latitude="37.64" longitude="-122.46"/>
</map>
```

To embed this map within a Hyperview screen, we need to give the vocabulary a [namespace name](https://en.wikipedia.org/wiki/XML_namespace). The namespace name should be a unique URI, so it's common to use the organization's web domain. For our map vocabulary, we will use `https://instawork.com/xml/map`. We can now declare the namespace in our Hyperview doc, assign it a prefix, and use that prefix for our elements:

```
<doc
    xmlns="https://hyperview.org/hyperview"
    xmlns:map="https://instawork.com/xml/map"
>
  <screen>
    <body>
      <text>This is my map!</text>
      <map:map latitude="37.65" longitude="-122.50" latitude-delta="0.1" longitude-delta="0.05">
        <map:marker latitude="37.65" longitude="-122.46"/>
        <map:marker latitude="37.64" longitude="-122.46"/>
      </map:map>
    </body>
  </screen>
</doc>
```

Let's break this down:
- In the `<doc>` tag, we've added the attribute `xmlns:map="https://instawork.com/xml/map"`. This declares that tags prefixed with "map" belong to the namespace `https://instawork.com/xml/map`.
- Within the `<body>` tag, we've added our map, but each tag is prefixed with `map:`.
- Note that the Hyperview tags don't require a prefix. That's because the `<doc>` attribute `xmlns="https://hyperview.org/hyperview"` declares Hyperview as the default namespace in the doc. Any unprefixed tag will be interpreted as part of the default namespace.

As you can see, namespaces support extensibility by allowing multiple XML vocabularies to co-exist and mix together in one document. APIs that process XML, such as the [DOM](https://en.wikipedia.org/wiki/Document_Object_Model), have built-in support for searching and querying in a namespace-aware way. This makes it easy to create a framework that can call out to plugins or registered classes when processing tags in a certain namespace.

In fact, that's exactly how [custom elements work in Hyperview](https://hyperview.org/docs/reference_custom_elements). Custom elements simply map a namespace and tag name to a React Native component written by the developer. When rendering a screen, if Hyperview comes across a namespaced tag, it looks up the associated component and renders it. Here's the kicker: Hyperview's core UI elements [work the same way](https://github.com/Instawork/hyperview/blob/master/src/components/hv-list/index.js#L21), there's no need for special handling!

### Why reinvent the wheel?

So by design, XML is highly extensible, but what about JSON? Well, there's not much to say since JSON doesn't have any native concept of namespaces or extensibility. Everything is one big nested data structure of arrays and dictionaries. Of course, it's possible to replicate the concept in JSON, maybe with a special `$namespace` property on an object, or a `<namespace>:<prop>` convention for objects keys. But JSON libraries would have no awareness that these properties have a semantic meaning, requiring developers to write a lot of special handling for this syntax.

***At Instawork, we prefer to stand on the shoulders of giants rather than reinvent the wheel.***

So when it came to creating Hyperview, we looked for well-understood, battle-tested tools that matched our needs. With XML, we knew we could evolve and extend the Hyperview spec using the proven technique of XML vocabularies and namespaces. This freed us up to focus on what's new and exciting in Hyperview: ***the ability to express the UI and interactions of today's mobile apps in a purely declarative way.***

Stay tuned for Part 3 in this series, where we'll look at some of the practical & ergonomic reasons we chose XML over JSON for Hyperview's data format.
