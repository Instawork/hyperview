---
id: example_pull_to_refresh
title: Pull to refresh
sidebar_label: Pull to refresh
---

Hyperview has built-in support for the pull-to-refresh gesture on [`<list>`](reference_list), [`<sectionlist>`](reference_sectionlist), and [`<view>`](reference_view) elements.

![pull to refresh](/img/example_pull_to_refresh1.gif)

<div style="text-align:center;margin-bottom:1em;">
  <a class="button" href="https://github.com/Instawork/hyperview/tree/master/examples/case_studies/pull_to_refresh">See the full code</a>
</div>

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Main" flex="1" paddingTop="48" paddingLeft="24" paddingRight="24" backgroundColor="white" />
      <style id="Item" flex="1" justifyContent="center" height="48" borderBottomWidth="1" borderBottomColor="#eee" />
    </styles>
    <body style="Main">
      <list
        trigger="refresh"
        href="/case_studies/pull_to_refresh/refresh.xml"
        action="replace"
      >
        <item key="1" style="Item">
          <text style="Item__Label">Item 1</text>
        </item>
        <item key="2" style="Item">
          <text style="Item__Label">Item 2</text>
        </item>
        <item key="3" style="Item">
          <text style="Item__Label">Item 3</text>
        </item>
      </list>
    </body>
  </screen>
</doc>
```

To enable pull-to-refresh on a `<list>` element, add `trigger="refresh"` and `action="replace"` to the element. Adding the trigger will add the pull-to-refresh gesture to the list. The replace action tells Hyperview to replace the list element with the XML response returned by making a request to `/pull_to_refresh/refresh.xml`:

```xml
<list
  xmlns="https://hyperview.org/hyperview"
  trigger="refresh"
  href="/case_studies/pull_to_refresh/refresh.xml"
  action="replace"
>
  <item key="4" style="Item">
    <text style="Item__Label">New Item!</text>
  </item>
  <item key="1" style="Item">
    <text style="Item__Label">List 1</text>
  </item>
  <item key="2" style="Item">
    <text style="Item__Label">List 2</text>
  </item>
</list>
```

When refreshed, "New Item!" will be added as the first element of the list. "Item 3" will be removed. Note that the replacement list itself needs to include the attributes for pull-to-refresh since it replaces the existing `<list>` element. If we didn't include the attributes in the replacement list, the user would only be able to do a pull-to-refresh gesture once!

### Infinite scroll + Pull to refresh
It's common for a list screen to support both infinite scroll and pull-to-refresh. It's possible to combine the spinner `<item>` from the [infinite scroll](/docs/example_infinite_scroll) example with list attributes described above to easily achieve both behaviors in one view!
