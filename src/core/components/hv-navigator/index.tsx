/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from 'hyperview/src/services/navigator/errors';

import {
  DOMString,
  Element,
  ID_DYNAMIC,
  ID_MODAL,
  LOCAL_NAME,
  NAVIGATOR_TYPE,
} from 'hyperview/src/services/navigator/types';
import {
  NavigationContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';
import { Options, Props } from './types';
import React, { PureComponent } from 'react';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
} from 'hyperview/src/services/navigator/imports';
import {
  getChildElements,
  getInitialNavRouteElement,
  getUrlFromHref,
} from 'hyperview/src/services/navigator/helpers';
import { ActionProps } from '../hv-screen/types';
import { DataProps } from '../hv-route/types';
import HvRoute from '../hv-route';

// *** AHG TYPES
const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

type State = undefined;

export default class HvNavigator extends PureComponent<
  Props | any,
  State | any
> {
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
      default:
    }
    throw new Errors.HvNavigatorError(
      `No component found for type '${localName}'`,
    );
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
    options: Options = {},
  ): React.ReactElement => {
    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        return (
          <Stack.Screen
            key={id}
            component={this.getComponent(localName)}
            getId={({ params }) => params?.url}
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
      default:
    }
    throw new Errors.HvNavigatorError(`No navigator found for type '${type}'`);
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
    const screens: React.ReactElement[] = [];
    if (!navContext) {
      return screens;
    }
    const elements: Element[] = getChildElements(element);

    for (let i = 0; i < elements.length; i += 1) {
      const child: Element = elements[i];
      if (
        child.localName === LOCAL_NAME.NAVIGATOR ||
        child.localName === LOCAL_NAME.NAV_ROUTE
      ) {
        const id: DOMString | null | undefined = child.getAttribute('id');
        if (!id) {
          throw new Errors.HvNavigatorError(
            `No id provided for ${child.localName}`,
          );
        }
        let initialParams: any = {};
        let url: string;
        let navParams: Props;
        let routeParams: DataProps & ActionProps;
        switch (child.localName) {
          case LOCAL_NAME.NAVIGATOR:
            navParams = { element: child };
            initialParams = navParams;
            break;
          case LOCAL_NAME.NAV_ROUTE:
            url = getUrlFromHref(
              child.getAttribute('href'),
              navContext?.entrypointUrl,
            );
            routeParams = {
              url,
            };
            initialParams = routeParams;
            break;
          default:
        }
        screens.push(
          this.buildScreen(id, initialParams, type, child.localName),
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
      default:
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
    options: Options,
  ) => {
    const id: DOMString | null | undefined = element.getAttribute('id');
    if (!id) {
      throw new Errors.HvNavigatorError('No id found for navigator');
    }
    if (!navContext) {
      throw new Errors.HvNavigatorError(
        'No NavigationContext context provided',
      );
    }

    const type: DOMString | null | undefined = element.getAttribute('type');
    const initial: Element | undefined = getInitialNavRouteElement(element);
    if (!initial) {
      throw new Errors.HvNavigatorError(`No initial route defined for '${id}'`);
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
            backBehavior="none"
            id={id}
            initialRouteName={initialId}
          >
            {this.buildScreens(navContext, element, type)}
          </TopTab.Navigator>
        );
      case NAVIGATOR_TYPE.BOTTOM_TAB:
        return (
          <BottomTab.Navigator
            backBehavior="none"
            id={id}
            initialRouteName={initialId}
            screenOptions={options}
          >
            {this.buildScreens(navContext, element, type)}
          </BottomTab.Navigator>
        );
      default:
    }
    throw new Errors.HvNavigatorError(
      `No navigator type '${type}'found for '${id}'`,
    );
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
