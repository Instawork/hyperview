// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Contexts from 'hyperview/src/contexts';
import * as UrlService from 'hyperview/src/services/url';
import { Document, LOCAL_NAME, NAVIGATOR_TYPE } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import {
  SCREEN_DYNAMIC,
  SCREEN_MODAL,
  cleanHrefFragment,
  getChildElements,
  getInitialNavRouteNode,
  getProp,
} from 'hyperview/src/navigator-helpers';
import { Text, View } from 'react-native';
import HyperviewRoute from 'hyperview/src/hv-nav-route';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

/**
 * HyperviewNavigator provides logic to process a <navigator> element.
 * Props:
 * - doc: the document to render
 * */
export default class HyperviewNavigator extends PureComponent {
  /**
   * Build the screens for the navigator as defined in the received document.
   */
  buildScreens = (doc: Document, navigator: Navigator, type: string) => {
    const screens = [];
    const elements = getChildElements(doc);
    for (let i = 0; i < elements.length; i += 1) {
      const node = elements[i];
      if (
        node.nodeName === LOCAL_NAME.NAVIGATOR ||
        node.nodeName === LOCAL_NAME.NAV_ROUTE
      ) {
        const id: string = node.getAttribute('id');

        let component = null;
        let initialParams = {};
        switch (node.nodeName) {
          case LOCAL_NAME.NAVIGATOR:
            component = HyperviewNavigator;
            initialParams = {
              doc,
              routeId: id,
            };
            break;
          case LOCAL_NAME.NAV_ROUTE:
            component = HyperviewRoute;
            initialParams = {
              routeId: id,
              url: UrlService.getUrlFromHref(
                cleanHrefFragment(node.getAttribute('href')),
                this.context.initialUrl,
              ),
            };
            break;
          default:
        }
        screens.push(
          <navigator.Screen
            key={id}
            component={component}
            initialParams={initialParams}
            name={id}
          />,
        );
      }
    }

    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        screens.push(
          <navigator.Screen
            key={SCREEN_DYNAMIC}
            component={HyperviewRoute}
            getId={({ params }) => params.url}
            name={SCREEN_DYNAMIC}
            options={({ route }) => ({
              title: route.params.url,
            })}
          />,
        );

        screens.push(
          <navigator.Screen
            key={SCREEN_MODAL}
            component={HyperviewRoute}
            getId={({ params }) => params.url}
            name={SCREEN_MODAL}
            options={({ route }) => ({
              presentation: 'modal',
              title: route.params.url,
            })}
          />,
        );
        break;
      default:
    }
    return screens;
  };

  /**
   * Build the navigator as defined in the received document.
   */
  buildNavigator = (options: Object) => {
    const doc = getProp(this.props, 'doc');
    if (!doc) {
      return null;
    }
    const id: string = doc.getAttribute('id');
    const type: string = doc.getAttribute('type');
    const initialNode = getInitialNavRouteNode(doc);
    const initialId: string = initialNode.getAttribute('id');

    let navigator;
    let backBehavior;
    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        navigator = Stack;
        break;
      case NAVIGATOR_TYPE.TOP_TAB:
        navigator = TopTab;
        backBehavior = 'none';
        break;
      case NAVIGATOR_TYPE.BOTTOM_TAB:
        navigator = BottomTab;
        backBehavior = 'none';
        break;
      default:
        return null;
    }
    const screens = this.buildScreens(doc, navigator, type);
    if (screens.length === 0) {
      return null;
    }
    return (
      <navigator.Navigator
        backBehavior={backBehavior}
        id={id}
        initialRouteName={initialId}
        screenOptions={options}
      >
        {screens}
      </navigator.Navigator>
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

HyperviewNavigator.contextType = Contexts.FetchContext;
