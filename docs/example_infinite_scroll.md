---
id: example_infinite_scroll
title: Infinite scroll
sidebar_label: Infinite scroll
---

You can create an infinite-scroll experience by using [`<list>`](reference_list) and [`<spinner>`](reference_spinner) elements with the `visible`, `once`, and `action` behavior attributes.

![infinite scroll](/img/example_infinite_scroll1.gif)

<div style="text-align:center;margin-bottom:1em;">
  <a class="button" href="https://github.com/Instawork/hyperview/tree/master/demo/backend/advanced/case-studies/infinite-scroll">See the full code</a>
</div>

```xml
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body" backgroundColor="white" flex="1" paddingTop="48" />
      <style
        id="Item"
        alignItems="center"
        borderBottomColor="#eee"
        borderBottomWidth="1"
        flex="1"
        flexDirection="row"
        height="48"
        justifyContent="space-between"
        paddingLeft="24"
        paddingRight="24"
      />
      <style id="Item__Label" fontSize="18" />
      <style
        id="Spinner"
        flex="1"
        height="48"
        justifyContent="center"
        alignItems="center"
      />
    </styles>
    <body style="Body">
      <list>
        <item key="1" style="Item">
          <text style="Item__Label">Item 1</text>
        </item>
        <item key="2" style="Item">
          <text style="Item__Label">Item 2</text>
        </item>

        // ... items 3 - 19 omitted

        <item key="20" style="Item">
          <text style="Item__Label">Item 20</text>
        </item>
        <item
          style="Spinner"
          key="loadMore"
          trigger="visible"
          once="true"
          href="/case_studies/infinite_scroll/page2.xml"
          action="replace"
        >
          <spinner />
        </item>
      </list>
    </body>
  </screen>
</doc>
```

We add a final item (with a spinner) to the list with a key that won't conflict with the other items (key=`loadMore`). The list item contains several behavior attributes:

- `trigger="visible"`: The behavior will be triggered when the item appears on screen, which will happen when the user reaches the bottom of the list.
- `once="true"`: The behavior will only trigger the first time the item appears on screen (to prevent duplicate triggers if the user scrolls up and down quickly)
- `href="/case_studies/infinite_scroll/page2.xml"`: The behavior will make a remote request to a server to get the second page of items.
- `action="replace"`: The XML in the response will replace the item with the spinner.

The response XML should just contain the new items to show in the list. Note that the root of the document is an `<items>` element. That's because the XML doc needs a single root element. That means we will be inserting a `<items>` into the existing `<list>`. This is ok because `<list>` will only render `<item>` child elements. Essentially, `<items>` is a payload wrapper that won't affect rendering of the list.

```xml
<items xmlns="https://hyperview.org/hyperview">
  <item key="21" style="Item">
    <text style="Item__Label">Added: Item 21</text>
  </item>

  // ... items 22 - 29 omitted

  <item key="30" style="Item">
    <text style="Item__Label">Added: Item 30</text>
  </item>
</items>
```

We end up with a list containing items 1-6, and a new spinner item that will load the third page when the user reaches the end of the list again.

We have two ways to handle the case where the user reaches the end of the list:

- When requesting an out-of-bounds page, respond with empty content:
  ```xml
  <items xmlns="https://hyperview.org/hyperview" />
  ```
  With this approach, the user will see one final spinner that disappears when the request completes.
- On the last page of items, omit the spinner `<item>` from the response. The user will scroll to the end of the list, and no further requests will be sent.

### Infinite scroll + Pull to refresh

It's common for a list screen to support both infinite scroll and pull-to-refresh. It's possible to combine the `<list>` attributes in the [pull to refresh](/docs/example_pull_to_refresh) example with the spinner item described above to easily achieve both behaviors in one view!
