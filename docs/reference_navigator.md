---
id: reference_navigator
title: <navigator>
sidebar_label: <navigator>
---

Navigation behaviors (see [behavior attributes/action](reference_behavior_attributes#action)) in Hyperview require a navigator to manage state. Navigators may be passed from an external implementation or may be created within Hyperview.

Navigator hierarchies are defined in HXML to provide a declarative expression of the navigation structure.

An example stack navigator.

```xml
<navigator id="root" type="stack">
  <nav-route ... />
</navigator>
```

## Structure

A `<navigator>` element can only appear as a direct and only child of a `<doc>` element. A `<navigator>` must contain at least one `<nav-route>` child. A `<navigator>` may contain one ore more `<behavior>` children. `<navigator>` elements can handle can only handle the `load` and `on-event` triggers.

An example navigator with behavior.

```xml
<navigator id="root" type="stack">
  <behavior trigger="load" ... />
  <behavior trigger="on-event" ... />
  <nav-route ... />
</navigator>
```

## Attributes

- [Navigator attributes](#navigator-attributes)
- [`id`](#id)
- [`type`](#type)
- [`merge`](#merge)

#### Navigator attributes

#### `id`

| Type   | Required |
| ------ | -------- |
| string | Yes      |

A global attribute uniquely identifying the element in the whole document.

#### `type`

| Type       | Required |
| ---------- | -------- |
| stack, tab | Yes      |

Navigators support two types:

1. **stack** navigators support pushing and popping screens in any order. They also support showing screens dynamically and displaying modal screens.
2. **tab** navigators support navigating between a set of screens in any order and are useful for tabbed navigation.

#### `merge`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

A declaration of how a new navigator should combine with the existing state. When **true** a `<navigator>` will merge with the existing state of a matching `<navigator>` (where id and hierarchy match).

#### `modal`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

[**stack navigator only**] Open a screen as a modal.

## Notes

### Instantiation

When instantiating the `<Hyperview>` component, passing a value for `navigation` will use an externally provided navigator. Without this value, Hyperview will create a navigator hierarchy based on a declarative HXML syntax. Navigation is handled through a custom implementation of [react-navigation](https://reactnavigation.org).

An example implementation using an external navigator provider.

```xml
return (
  <Hyperview
    back={goBack}
    closeModal={closeModal}
    entrypointUrl={entrypointUrl as string}
    fetch={fetchWrapper}
    formatDate={formatDate}
    navigate={navigate}
    navigation={props.navigation}
    openModal={openModal}
    push={push}
    route={props.route}
  />
  );
```

### Example

A common application configuration is to provide users with a tabbed main screen with the ability to open other screens onto a stack. This can be easily setup by creating a nested navigator hierarchy. See [nav-route](reference_nav_route) for more information about `<nav-route>` elements.

```xml
<doc>
  <navigator id="root" type="stack">
    <nav-route id="tabs-route" href="">
      <navigator id="tabs" type="tab">
        <nav-route id="tab-1" href="/tab_1.xml">
        <nav-route id="tab-2" href="/tab_2.xml">
      </navigator>
    </nav-route>
  </navigator>
</doc>
```

In this example, the top navigator is a `stack` type and supports showing new screens dynamically using `navigate`, `push`, or `new` behavior actions. The inner navigator is a `tab` and will be displayed as the default view.

### Pre-stacking

There may be cases where pushing multiple screens onto a stack at startup is useful. Adding multiple `<nav-route>` elements into a `stack` navigator has the effect of pushing all routes at once.

```xml
<doc>
  <navigator id="root" type="stack">
    <nav-route id="home" href="/home.xml" />
    <nav-route id="welcome" href="/welcome.xml" modal="true" />
  </navigator>
</doc>
```

In this example, when the document is loaded, the "welcome" screen will be displayed as a modal over the "home" screen. The user will need to close the modal in order to see the "home" screen.
