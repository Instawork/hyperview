// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Document, LOCAL_NAME, NAVIGATOR_TYPE } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import {
  getChildElements,
  getInitialNavRouteNode,
  getProp,
} from 'hyperview/src/navigator-helpers';
import HyperviewRoute from 'hyperview/src/hv-nav-route';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// // import NavContext, { NavProvider } from './hv-nav-context';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

/**
 * HyperviewNavigator provides logic to process a <navigator> element.
 * Props:
 * - parent: the parent component
 * - doc: the document to render
 * */
export default class HyperviewNavigator extends PureComponent {
  // static contextType = NavContext;

  buildScreens = (doc: Document, navigator: Navigator) => {
    const screens = [];
    const elements = getChildElements(doc);
    for (let i = 0; i < elements.length; i += 1) {
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
          component = HyperviewNavigator;
          initialParams = {
            doc,
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
          key={name}
          component={component}
          initialParams={initialParams}
          name={name}
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
    const screens = this.buildScreens(doc, navigator);
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
  };

  render() {
    try {
      const navigator = this.buildNavigator({
        headerShown: true,
      });
      if (!navigator) {
        return (
          <View
            style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
          >
            <Text>NAV ERROR: No Navigator</Text>
          </View>
        );
      }
      return navigator;
    } catch (err) {
      return (
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          <Text>NAV ERROR: {err.message}</Text>
        </View>
      );
    }
  }
}