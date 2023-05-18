/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as HvNavigatorProps from './types';
import * as HvRouteParams from '../hv-route/types';
import * as HvScreenParams from '../hv-screen/types';

import React, { PureComponent, ReactNode } from 'react';

import {
  getChildElements,
  getInitialNavRouteElement,
  getUrlFromHref,
} from 'hyperview/src/services/navigator/helpers';
import {
  NavigationContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';
import {
  DOMString,
  Element,
  NAVIGATOR_TYPE,
  LOCAL_NAME,
  ID_DYNAMIC,
  ID_MODAL,
} from 'hyperview/src/services/navigator/types';

import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
} from 'hyperview/src/services/navigator/imports';

import HvRoute from '../hv-route';
import HvTest from './temptest';
const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

type Props = HvNavigatorProps.Props;
type State = {};

export default class HvNavigator extends PureComponent<Props, State> {
  /**
   * Dynamically create the appropriate component based on the localName
   * @param localName
   * @returns
   */
  getComponent = (localName: string): any => {
    switch (localName) {
      case LOCAL_NAME.NAVIGATOR:
        return HvNavigator;
      case LOCAL_NAME.NAV_ROUTE:
        return HvRoute;
    }
    throw new Error('No component found');
  };

  /**
   * Build an individual screen
   * @param id
   * @param initialParams
   * @param type
   * @param localName
   * @returns
   */
  buildScreen = (
    id: string,
    initialParams: any,
    type: DOMString,
    localName: string,
    options: HvNavigatorProps.Options = {},
  ): JSX.Element => {
    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        return (
          <Stack.Screen
            key={id}
            component={this.getComponent(localName)}
            initialParams={initialParams}
            name={id}
            options={options}
          />
        );
      case NAVIGATOR_TYPE.TOP_TAB:
        return (
          <TopTab.Screen
            key={id}
            component={this.getComponent(localName)}
            initialParams={initialParams}
            name={id}
          />
        );
      case NAVIGATOR_TYPE.BOTTOM_TAB:
        return (
          <BottomTab.Screen
            key={id}
            component={this.getComponent(localName)}
            initialParams={initialParams}
            name={id}
            options={options}
          />
        );
    }
    throw new Error('No navigator type found');
  };

  /**
   * Build all screens from received routes
   * @param navContext
   * @param element
   * @param type
   * @returns
   */
  buildScreens = (
    navContext: NavigationContextProps | null,
    element: Element,
    type: DOMString,
  ): React.ReactNode => {
    const screens: JSX.Element[] = [];
    if (!navContext) {
      return screens;
    }
    const elements: Element[] = getChildElements(element);

    for (let i = 0; i < elements.length; i += 1) {
      const element: Element = elements[i];
      if (
        element.localName === LOCAL_NAME.NAVIGATOR ||
        element.localName === LOCAL_NAME.NAV_ROUTE
      ) {
        const id: DOMString | null | undefined = element.getAttribute('id');
        if (!id) {
          throw new Error('No id found');
        }
        let initialParams: any = {};
        switch (element.localName) {
          case LOCAL_NAME.NAVIGATOR:
            const navParams: HvNavigatorProps.Props = { element: element };
            initialParams = navParams;
            break;
          case LOCAL_NAME.NAV_ROUTE:
            const routeUrl: string = getUrlFromHref(
              element.getAttribute('href'),
              navContext?.entrypointUrl,
            );
            const routeParams: HvRouteParams.DataProps = {
              url: routeUrl,
            };
            initialParams = routeParams;
            break;
        }
        screens.push(
          this.buildScreen(id, initialParams, type, element.localName),
        );
      }
    }

    // Add the dynamic screens
    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        screens.push(
          this.buildScreen(ID_DYNAMIC, {}, type, LOCAL_NAME.NAV_ROUTE),
        );

        screens.push(
          this.buildScreen(ID_MODAL, {}, type, LOCAL_NAME.NAV_ROUTE, {
            presentation: 'modal',
          }),
        );
        break;
    }
    return screens;
  };

  /**
   * Build the required navigator from the element
   * @param options
   * @returns
   */
  buildNavigator = (
    navContext: NavigationContextProps | null,
    element: Element,
    options: HvNavigatorProps.Options,
  ) => {
    const id: DOMString | null | undefined = element.getAttribute('id');
    if (!id) {
      throw new Error('No id found');
    }
    if (!navContext) {
      throw new Error('No context found');
    }
    const type: DOMString | null | undefined = element.getAttribute('type');
    const initial: Element | undefined = getInitialNavRouteElement(element);
    if (!initial) {
      throw new Error('No initial route found');
    }

    const initialId: string | undefined = initial
      .getAttribute('id')
      ?.toString();

    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        return (
          <Stack.Navigator
            id={id}
            initialRouteName={initialId}
            screenOptions={options}
          >
            {this.buildScreens(navContext, element, type)}
          </Stack.Navigator>
        );
      case NAVIGATOR_TYPE.TOP_TAB:
        return (
          <TopTab.Navigator
            id={id}
            initialRouteName={initialId}
            backBehavior="none"
          >
            {this.buildScreens(navContext, element, type)}
          </TopTab.Navigator>
        );
      case NAVIGATOR_TYPE.BOTTOM_TAB:
        return (
          <BottomTab.Navigator
            id={id}
            initialRouteName={initialId}
            backBehavior="none"
            screenOptions={options}
          >
            {this.buildScreens(navContext, element, type)}
          </BottomTab.Navigator>
        );
      default:
    }
  };

  render() {
    return (
      <NavigationContext.Consumer>
        {navContext =>
          this.buildNavigator(navContext, this.props.element, {
            headerShown: true,
          })
        }
      </NavigationContext.Consumer>
    );
  }
}
