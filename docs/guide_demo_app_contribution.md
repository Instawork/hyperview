# **Demo App Contributor Guide**
[Getting Started with Demo App](#demoappcontributorguide-gettingstartedwithdemoapp)

[Folder Structure](#demoappcontributorguide-folderstructure)

&nbsp;&nbsp;&nbsp;&nbsp;[Index](#demoappcontributorguide-index)

&nbsp;&nbsp;&nbsp;&nbsp;[Includes](#demoappcontributorguide-includes)

&nbsp;&nbsp;&nbsp;&nbsp;[Examples with multiple demonstrations](#demoappcontributorguide-exampleswithmultipledemonstrations)

[Eleventy’s Front Matter](#demoappcontributorguide-eleventy’sfrontmatter)

&nbsp;&nbsp;&nbsp;&nbsp;[Built-in Properties](#demoappcontributorguide-built-inproperties)

&nbsp;&nbsp;&nbsp;&nbsp;[Custom Properties](#demoappcontributorguide-customproperties)

[Rendering List Items](#demoappcontributorguide-renderinglistitems)

[Rendering Section List of Items](#demoappcontributorguide-renderingsectionlistofitems)

[Conventions](#demoappcontributorguide-conventions)

&nbsp;&nbsp;&nbsp;&nbsp;[Href](#demoappcontributorguide-href)

&nbsp;&nbsp;&nbsp;&nbsp;[Case](#demoappcontributorguide-case)

&nbsp;&nbsp;&nbsp;&nbsp;[Files](#demoappcontributorguide-files)

&nbsp;&nbsp;&nbsp;&nbsp;[Front matter](#demoappcontributorguide-frontmatter)

&nbsp;&nbsp;&nbsp;&nbsp;[Styles](#demoappcontributorguide-styles)

&nbsp;&nbsp;&nbsp;&nbsp;[XML attributes](#demoappcontributorguide-xmlattributes)
## <a name="demoappcontributorguide-gettingstartedwithdemoapp"></a>**Getting Started with Demo App**
<https://github.com/Instawork/hyperview?tab=readme-ov-file#2-start-the-demo-app>
## <a name="demoappcontributorguide-folderstructure"></a>**Folder Structure**
### <a name="demoappcontributorguide-index"></a>**Index**
Every page (or tab) in the app is represented as a folder and will have an associated index file. Any partial/fragment called by an example should reside in the same directory.
```ui/``` , ```case-studies/``` , ```navigation/``` , ```advanced/``` are self contained folders for each tab on the home screen. We follow the same structure for any pages inside.
### <a name="demoappcontributorguide-includes"></a>**Includes**
All included files go under ```\_includes/``` folder to contain reusable files across the app. Eleventy surfaces its contents in the root

1. templates/
   1. ```list.xml.njk```: Renders a list of items , each linking to a different screen
   1. ```section-list.xml.njk```: Renders a section list of items with subtitles
   1. ```tab.xml.njk``` : Basic tab structure for tabs on home screen
   1. ```styles.xml.njk``` : Contains re-usable styles across the app.
   1. ```base.xml.njk```: Base template for all the screens. Can be extended by providing custom styles and content
   1. ```scrollview.xml.njk```: Extends ```base.xml.njk``` to provide a scroll view for any screen that extends it.
   1. ```loading-screen.xml.njk``` : Included as a loading screen in other templates
   1. ```header.xml.njk``` : Used to render the header button logic
1. ```icons/``` : All icons used across the app go into this folder.
1. ```macros/``` : Folder that includes all reusable macros. Each macro should have a separate folder with ```index.xml.njk``` containing the definition along with ```styles.xml.njk``` containing the styles
### <a name="demoappcontributorguide-exampleswithmultipledemonstrations"></a>**Examples with multiple demonstrations**
![options_example.png](/img/options_example.png)

For screens with single demonstration, ```index.xml.njk``` to include the logic

For screens with multiple demonstrations, each demonstration to be added through a separate file. The root ```index.xml.njk``` of the example to include styles and index file inside each demonstration folder. Any style common to multiple demonstrations of an example can be included in the example’s ```index.xml.njk```. For example:

```xml
options/
  no-options/
    index.xml.njk
    styles.xml.njk (any style specific to no-option demonstration.)
  one-option/
    index.xml.njk
    styles.xml.njk
  two-options/
    index.xml.njk
    styles.xml.njk
  index.xml.njk (includes all styles.xml.njk and index.xml.njk files)
```

Path to lookup a style declaration: style.xml.njk of the demonstration → styles block in example’s ```index.xml.njk``` → ```\_includes/styles.xml.njk```
## <a name="demoappcontributorguide-eleventy’sfrontmatter"></a>[**Eleventy’s Front Matter**](https://www.11ty.dev/docs/data-frontmatter/)
Metadata used to define variables or settings that are used by eleventy while processing a .njk file.
### <a name="demoappcontributorguide-built-inproperties"></a>**Built-in Properties**
- ```permalink```: The URL where the page will be available. In our case, the .xml file output.```/\_data/eleventyComputed.js``` computes this automatically.
- ```tags```: List of tags associated with the file. These tags can be used to categorize or filter files. For example, you might have a blog post with the tags ["programming", "python", "tutorial"]. These tags could be used to find all blog posts about programming, or all blog posts about Python.
### <a name="demoappcontributorguide-customproperties"></a>**Custom Properties**
- ```hv\_tab\_id```: An identifier for a tab on the home screen. Used inside tab.xml.njk for selecting the tab in tab bar
- ```hv\_button\_behavior```: A variable that controls the behavior of the header button on the page. In this case, can have values ```"close"```, ```"none"``` and ```default "back"```
- ```hv\_list\_tags```: Used to specify a list of ```tags``` that should be displayed on the page. All files specifying a certain ```hv\_list\_tags``` as their ```tags``` are included in the list.
- ```hv\_title```: The title of the page. This could be used in a ```<title>``` tag in the HTML head, or as a heading in the body of the page.
- ```hv\_open\_modal```: Opens the example in a new modal instead of a screen if set to ```true```
## <a name="demoappcontributorguide-renderinglistitems"></a>**Rendering List Items**
![rendering_list_items.png](/img/rendering_list_items.png)

To render a list view as shown above:

1. In ```ui/index.xml.njk```, include ```templates/list.xml.njk``` and define ```hv\_list\_tag```: "styling" inside the metadata:

```xml
---
permalink: "/ui/styling/index.xml"
hv_title: "Styling"
hv_button_behavior: "back"
---
{% set hv_list_tag = "styling" %}
{% include "templates/list.xml.njk" %}
```

2. In ui/styling/button/index.xml.njk, define the tag to which this item links to (in our case styling):

```xml
---
permalink: "/ui/styling/button/index.xml"
tags: "styling"
hv_title: "Button"
hv_button_behavior: "back"
---
{% extends 'templates/scrollview.xml.njk' %}
{# Custom logic for showing content after clicking UI Elements list item #}
```
## <a name="demoappcontributorguide-renderingsectionlistofitems"></a>**Rendering Section List of Items**
Renders item similar to list but also has sub titles to further group them

Uses ```hv\_section\_list\_tag``` to group items.

![rendering_section_list_items.png](/img/rendering_section_list_items.png)
## <a name="demoappcontributorguide-conventions"></a>**Conventions**
### <a name="demoappcontributorguide-href"></a>**Href**
All the href paths should start with ```“/hyperview/public/”``` . This ensures that requested resource on both github pages and local setup is consistent.
### <a name="demoappcontributorguide-case"></a>**Case**
1. File names, style ids are to follow kebab case, i.e. custom-select, custom-select-bold
1. style ids and element ids should not overlap. i.e., ```<style id="container" />``` and ```<view id="container" />```
### <a name="demoappcontributorguide-files"></a>**Files**
1. Every file ends with a line break
### <a name="demoappcontributorguide-frontmatter"></a>**Front matter**
1. All custom front matter attributes start with prefix ```hv\_``` . example: ```hv\_button\_behavior```
1. Built-in Properties come first followed by custom properties
### <a name="demoappcontributorguide-styles"></a>**Styles**
1. Include styles re-used across multiple screens inside ```\_includes/styles.xml.njk```
### <a name="demoappcontributorguide-xmlattributes"></a>**XML attributes**
We accept two formats to render attributes of an XML element:

1. inline (provided that the total number of characters does not exceed 80)
1. one attribute per line

When rendering the attributes inline, the element closing delimiter and the element closing tag should be on the same line. If the element is a self closing tag, there should be a single space between the last attribute's value and the self closing tag. If the element is not a self closing tag, there should be no leading space before the element delimiter.
When rendering one attribute per line, the element delimiter should be rendered on a new line, and the indentation level should match the element opening tag. Use alphabetical order for XML element attributes, exception made for id which should be first attribute of the element.

i.e:

```xml
  <text id="foo"></text>
  <behavior href="/" />
  <behavior
    href="/"
    action="new"
  />
```

```xml
  <text id="foo" ></text>
  <behavior href="/"/>
  <behavior
    href="/"
    action="new"/>
```
