import {
  getInitialNavRouteNode,
  getChildElements,
  getProp,
} from 'hyperview/src/navigator-helpers';
import HyperviewRoute from 'hyperview/src/hv-nav-route';
// import HyperScreen from 'hyperview';
// // import NavContext, { NavProvider } from './hv-nav-context';
import { LOCAL_NAME, NAVIGATOR_TYPE, Document } from 'hyperview/src/types';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Component } from 'react';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

/**
 * HyperviewNavigator provides logic to process a <navigator> element.
 * Props:
 * - parent: the parent component
 * - doc: the document to render
 * */
export default class HyperviewNavigator extends Component {
  constructor(props) {
    super(props);
  }

  // static contextType = NavContext;

  buildScreens = (doc: Document, navigator: Navigator) => {
    const screens = [];
    const elements = getChildElements(doc);
    for (let i = 0; i < elements.length; i++) {
      const node = elements[i];
      let name = '';
      if (
        node.nodeName === LOCAL_NAME.NAVIGATOR ||
        node.nodeName === LOCAL_NAME.NAV_ROUTE
      ) {
        name = node.getAttribute('id');
      }
      // console.log('buildScreens', node.nodeName, name);
      let component = null;
      let initialParams = {};
      switch (node.nodeName) {
        case LOCAL_NAME.NAVIGATOR:
          component = HyperNavigator;
          initialParams = {
            doc: doc,
          };
          break;
        case LOCAL_NAME.NAV_ROUTE:
          component = HyperviewRoute;
          initialParams = {
            url: node.getAttribute('href'),
          };
          break;
        default:
          continue;
      }

      screens.push(
        <navigator.Screen
          name={name}
          key={name}
          initialParams={initialParams}
          component={component}
        />,
      );
    }
    return screens;
  };

  buildNavigator = (options: Object) => {
    const doc = getProp(this.props, 'doc');
    const id = doc.getAttribute('id');
    const type = doc.getAttribute('type');
    const initialNode = getInitialNavRouteNode(doc);
    const initialId = initialNode.getAttribute('id');

    let screens;
    let navigator;
    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        navigator = Stack;
        break;
      case NAVIGATOR_TYPE.TOP_TAB:
        navigator = TopTab;
        break;
      case NAVIGATOR_TYPE.BOTTOM_TAB:
        navigator = BottomTab;
        break;
      default:
        return null;
    }
    screens = this.buildScreens(doc, navigator);
    // console.log('buildNavigator', screens.length, initialRouteName);
    if (screens.length === 0) {
      return null;
    }

    return (
      // <NavProvider value={{ parent: this }}>
      <navigator.Navigator
        id={id}
        initialRouteName={initialId}
        screenOptions={options}
      >
        {screens}
      </navigator.Navigator>
      // </NavProvider>
    );
    return null;
  };

  render() {
    try {
      const navigator = this.buildNavigator({
        headerShown: true,
      });
      if (!navigator) {
        return (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text>NAV ERROR: No Navigator</Text>
          </View>
        );
      }
      return navigator;
    } catch (err) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>NAV ERROR: {err.message}</Text>
        </View>
      );
    }
  }
}
