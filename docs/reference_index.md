---
id: reference_index
title: Reference
sidebar_label: Index
---

### Hyperview XML

Hyperview XML (HXML) is a hypermedia, XML-based format used to define mobile app screens. HXML provides a set of tags and attributes that define a screen's layout, styling, and available user interactions.

#### Behaviors

Behaviors in HXML define actions that should happen in the app, in response to a user-based trigger. Behaviors can either be specified as attributes on other HXML elements, or as a child `<behavior>` element.

- [Behavior attributes](/docs/reference_behavior_attributes) Goes in-depth about the HXML attributes used to define a behavior.
- [`<behavior>`](/docs/reference_behavior): An element that accepts behavior attributes and applies the behavior to the parent element. Often used when an element needs to define multiple behaviors.

#### Display Elements

Display elements in HXML can be combined to define the layout of a screen.

- [`<doc>`](/docs/reference_doc): The top-level element in HXML, used to include multiple screens in one response.
- [`<screen>`](/docs/reference_screen): A single screen of a mobile app.
- [`<header>`](/docs/reference_header): The header of a mobile app screen.
- [`<body>`](/docs/reference_body): The body of a mobile app screen (everything below the header).
- [`<view>`](/docs/reference_view): The basic building block of a screen's layout. Support flex styling, colors, borders, etc.
- [`<text>`](/docs/reference_text): Any text content on a screen. Supports text styling.
- [`<image>`](/docs/reference_image): Any image content on a screen.
- [`<list>`](/docs/reference_list): Efficient layout of repeated items on a screen. Supports list-specific interactions like pull-to-refresh.
- [`<section-list>`](/docs/reference_sectionlist): Efficient layout of sectioned (grouped) repeated items on a screen. Supports list-specific interactions like pull-to-refresh.
- [`<section>`](/docs/reference_sectionlist): [Deprecated] Groups `<item>` and `<section-title>` elements in a `<section-list>`.
- [`<section-title>`](/docs/reference_sectiontitle): The header of a group of `<item>` in a `<section-list>`.
- [`<item>`](/docs/reference_item): An individual item in a `<list>` or `<section-list>`.
- [`<spinner>`](/docs/reference_spinner): Activity indicator element.

#### Input Elements

Input elements in HXML allow users to set local state on a Hyperview screen. This state can be serialized with backend requests, or used for client-side interactions.

- [`<form>`](/docs/reference_form): An element used to group together several inputs for request serialization.
- [`<text-field>`](/docs/reference_textfield): An element used to accept single-line text input.
- [`<text-area>`](/docs/reference_textarea): An element used to accept multi-line text input.
- [`<select-single>`](/docs/reference_selectsingle): An element that groups many `<option>` elements, and allows only one of the options to be selected at a time.
- [`<select-multiple>`](/docs/reference_selectmultiple): An element that groups many `<option>` elements, and allows any number of options to be selected/deselected.
- [`<option>`](/docs/reference_option): The `<option>` element represents an input choice within a `<select-single>` or `<select-multiple>`.

#### Style Elements

Style elements in HXML define rules for the appearance of display and input elements.o

- [`<styles>`](/docs/reference_styles): Groups together all of the `<style>` rules for a screen.
- [`<style>`](/docs/reference_style): A single style rule with unique id in the screen, can set multiple appearance properties.
- [`<modifier>`](/docs/reference_modifier): Defines an appearance that should override the default for a style under certain local conditions, such as a user tap, selection, etc.

### React Native Client

The Hyperview RN Client is a library that can parse and render HXML in a React Native app.

- The [`Hyperview`](/docs/reference_hyperview_component) class defines a component that takes an endpoint URL and configuration props to render Hyperview screens in an app.
- [Custom Elements](/docs/reference_custom_elements): The Hyperview client can be extended by registering custom HXML elements and tags with custom RN components. This can be used to add elements with rich interactions, such as maps.
- [Custom Behaviors](/docs/reference_custom_behaviors): The Hyperview client can be extended by registering custom callbacks that can be triggered via `<behavior>` elements in the HXML. Supports features like dispatching Redux actions, triggering phone calls and share sheets, event logging, etc.
