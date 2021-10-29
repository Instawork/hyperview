---
id: reference_custom_elements
title: Custom elements
sidebar_label: Custom elements
---

> **NOTE**: custom elements are still under active development. The architecture will be changing in the near future to add more flexibility.

The `Hyperview` can be extended with custom elements that can be referenced and configured via HXML. Custom elements allow you to create rich, interactive client-side components, while controlling the layout of these elements from the backend server.

#### Creating custom elements

Custom Hyperview elements are backed by a React Native component. Any React Native component can be a custom element. There are only two required static class properties for custom components:

| Property     | Type   | Required | Description                                                   |
| ------------ | ------ | -------- | ------------------------------------------------------------- |
| namespaceURI | string | Yes      | The XML namespace for the element                             |
| localName    | string | Yes      | The local tag name (within the XML namespace) for the element |
| getFormInputValues    | function | No      | A function with the signature `(element): Array<[string, string]>`. Add this if your custom element contains data that should be serialized into a parent form. The array return value allows for the custom element to serialize multiple name/value pairs. Most commonly, your element would return one name/value pair, like `[["first_name", "Alice"]]`. You can also return multiple values for one name, like `[["choice", "1"], ["choice", "2"]]`. Or multiple values with multiple names, like `[["state", "CA"], ["country", "USA"]]`|

When rendering the component, Hyperview will pass screen context to `render()` as props. The component is free to use these props if it wants to render sub-children:

| Prop        | Type                  | Description                                 |
| ----------- | --------------------- | ------------------------------------------- |
| element     | xmldom Element object | The element DOM object from the HXML        |
| stylesheets | object                | RN Stylesheets defined in the screen's HXML |
| onUpdates   | function              | Callback that triggers a behavior           |

For example, if we wanted to expose a map element within Hyperview, we can wrap `MapView` from `react-native-maps` in a class that adds the two required properties:

```es6
import Hyperview from 'hyperview';
import MapView from 'react-native-maps';

export default class HyperviewMap extends PureComponent<Props> {
  static namespaceURI = 'https://instawork.com/hyperview-map';
  static localName = 'map';

  render() {
    // Parses the HXML elements attributes.
    // Returns styles and custom props.
    const props = Hyperview.createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    // Render any HXML sub-elements using Hyperview.
    const children = Hyperview.renderChildren(
      this.props.element,
      this.props.stylesheets,
      this.props.onUpdate,
      this.props.options,
    );

    const region = {
      latitude: parseFloat(props.latitude),
      longitude: parseFloat(props.longitude),
      latitudeDelta: parseFloat(props['latitude-delta']),
      longitudeDelta: parseFloat(props['longitude-delta']),
    };

    return (
      <MapView {...props} region={region} liteMode>
        {children}
      </MapView>
    );
  }
}
```

#### Configuring the client

Once you've defined a RN component with the required static properties, you can pass the class to the `Hyperview` component. This will register the component as an element available to be used during rendering of the screen. Custom components are passed in using the `cmoponents` prop, which takes an array of component classes.

```es6
function Screen({ url }) {
  return (
    <Hyperview entrypointUrl={url} fetch={fetch} components={[HyperviewMap]} />
  );
}
```

#### Using in HXML

Now that the custom element is registered with the Hyperview component, you can reference it in HXML using the provided namespace and tag name:

```xml
<view xmlns:maps="https://instawork.com/hyperview-map">
  <maps:map
    latitude="37.781229"
    longitude="-122.393232"
    latitude-delta="0.0922"
    longitude-delta="0.0421"
  />
</view>
```

This would display a map with the given coordinates and zoom level on a Hyperview screen.
