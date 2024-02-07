---
id: reference_nav_route
title: <nav-route>
sidebar_label: <nav-route>
---

Nav-Routes provide the navigation details for [navigators](/docs/reference_navigator).

An example nav-route.

```xml
<nav-route id="index-route" href="/index.xml" />
```

## Structure

A `<nav-route>` element can only appear as a direct child of a `<navigator>` element. A `<nav-route>` may contain one `<navigator>`.

An example nav-route with child `<navigator>`.

```xml
<nav-route id="index" href="">
  <navigator id="tabs" type="tab">
    ...
  </navigator>
</nav-route>
```

## Attributes

- [Route attributes](#nav-route-attributes)
- [`id`](#id)
- [`href`](#href)
- [`selected`](#selected)
- [`modal`](#modal)

#### Nav-Route attributes

#### `id`

| Type   | Required |
| ------ | -------- |
| string | Yes      |

A global attribute uniquely identifying the element in the whole document. This id may be used for navigation between routes.

#### `href`

| Type   | Required |
| ------ | -------- |
| string | No       |

The href to load when navigating to this route. If the `<nav-route>` has a direct `<navigation>` child, the `href` is ignored. The load will occur the first time the route is focused.

#### `selected`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

[**tab navigator only**] The nav-route to initially select. If not present, the first nav-route is selected.

#### `modal`

| Type                      | Required |
| ------------------------- | -------- |
| **false** (default), true | No       |

[**stack navigator only**] Open a nav-route as a modal.
