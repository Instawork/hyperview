# Hyperview changelog

**Version 0.10.1**

- Proper support for behaviors that don't involve href (#38)
- Proper Android support for sending empty forms (#39)
- Rename `yarn build-demo` to `yarn sync [path]` (#52)
- Improve `yarn build:demo` command (#51)

**Version 0.10.0**

- Add behavior registry (#48)
- Ignore vim swap files (#47)
- Iterate on the `yarn build:demo` command (#43)
- Docs: Demo on android simulator (#41)
- Fix: Add expo-cli to demo app (#40)
- Add auto-focus attribute to text-field (#36)
- Add hyperview watch mode for demo app (#32)
- Add xml debugging (#34)
- Add resizeMode to image stylesheet (#33)
- New blog post: XML extensibility (#31)
- Fix link to reference_behavior_attributes (#30)
- Remove animation implementation (#28)
- Fix syntax formatting in Markdown files (#29)
- Show helpful XML parse errors (#27)
- Warn when encountering unsupported tags or behaviors in XML (#26)
- Improve CHANGELOG readability and document hierarchy (#25)

**Version 0.9.0**

- Added support for "reload" behavior

**Version 0.8.0**

- Added support for "sms" behavior

**Version 0.7.0**

- Added support for "alert" behavior.

**Version 0.6.0**

- Change default namespace from `https://instawork.com/hyperview` to `https://hyperview.org/hyperview`

**Version 0.5.0**

- Add `share` action type for `<behavior>` tag
- BUG INTRODUCED: `<text-area>` does not render in this version due to a regression when moving to the component registry.

**Version 0.4.0**

- Added `keyboard-type` attribute on `<text-field>` elements.
- Added `deselect` trigger on `<select-single>` and `<select-multiple>` elements.
- Renamed `<sectionlist>` to `<section-list>` for consistency.
- Renamed `<sectiontitle>` to `<section-title>` for consistency.
- Add `mask` attribute to `<text-field>`.

**Version 0.3.0**

- Added `scroll-orientation` attribute to `<view>` elements.

**Version 0.2.0**

- Added `opacity` to supported style rules.
- Added support for modifier styles. Allowed modifiers: `pressed`, `focused`, `selected`.
- Added `<select-single>`, `<select-multiple>`, `<option>`, `<form>` elements.
- Added `select` trigger on `<select-single>` and `<select-multiple>` elements.
- Support for custom "phone" behaviors to initiate calls.

**Version 0.1.0**

- Added `<screen>`, `<body>`, `<header>`, `<view>`, `<text>`, `<text-field>`, `<text-area>`, `<form>`, `<list>`, `<sectionlist>`, `<section>`, `<item>`, `<spinner>` elements.
- Added 'press', 'longPress', 'pressIn', 'pressOut', 'load', 'visible' triggers.
- 'push', 'new', 'back', 'close', 'navigate', 'replace', 'replace-inner', 'append', 'prepend' actions
- custom behaviors for Redux, Intercom, Amplitude
