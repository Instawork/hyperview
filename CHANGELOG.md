## Hyperview changelog

0.9

- Added support for "reload" behavior

  0.8

- Added support for "sms" behavior

  0.7

- Added support for "alert" behavior.

  0.6

- Change default namespace from `https://instawork.com/hyperview` to `https://hyperview.org/hyperview`

  0.5

- Add `share` action type for `<behavior>` tag
- BUG INTRODUCED: `<text-area>` does not render in this version due to a regression when moving to the component registry.

  0.4

- Added `keyboard-type` attribute on `<text-field>` elements.
- Added `deselect` trigger on `<select-single>` and `<select-multiple>` elements.
- Renamed `<sectionlist>` to `<section-list>` for consistency.
- Renamed `<sectiontitle>` to `<section-title>` for consistency.
- Add `mask` attribute to `<text-field>`.

  0.3

- Added `scroll-orientation` attribute to `<view>` elements.

  0.2

- Added `opacity` to supported style rules.
- Added support for modifier styles. Allowed modifiers: `pressed`, `focused`, `selected`.
- Added `<select-single>`, `<select-multiple>`, `<option>`, `<form>` elements.
- Added `select` trigger on `<select-single>` and `<select-multiple>` elements.
- Support for custom "phone" behaviors to initiate calls.

  0.1

- Added `<screen>`, `<body>`, `<header>`, `<view>`, `<text>`, `<text-field>`, `<text-area>`, `<form>`, `<list>`, `<sectionlist>`, `<section>`, `<item>`, `<spinner>` elements.
- Added 'press', 'longPress', 'pressIn', 'pressOut', 'load', 'visible' triggers.
- 'push', 'new', 'back', 'close', 'navigate', 'replace', 'replace-inner', 'append', 'prepend' actions
- custom behaviors for Redux, Intercom, Amplitude
