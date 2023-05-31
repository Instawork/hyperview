/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from 'hyperview/src/services/navigator/errors';

import { DOMString, Element, LOCAL_NAME } from 'hyperview/src/types-legacy';
import {
  ID_DYNAMIC,
  ID_MODAL,
  NAVIGATOR_TYPE,
} from 'hyperview/src/services/navigator/types';
import {
  NavigationContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';
import {
  NavigatorCache,
  NavigatorMapContext,
  NavigatorMapProvider,
} from 'hyperview/src/contexts/navigator';
import React, { PureComponent, useContext } from 'react';
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
import HvRoute from 'hyperview/src/core/components/hv-route';
import { Props } from './types';
import { RouteParams } from 'hyperview/src/core/components/hv-route/types';
import { getFirstTag } from 'hyperview/src/services/dom/helpers-legacy';

type ParamTypes = {
  dynamic: RouteParams;
  modal: RouteParams;
};

/**
 * Flag to show the navigator UIs
 */
const SHOW_NAVIGATION_UI = true;

const Stack = createStackNavigator<ParamTypes>();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

export default class HvNavigator extends PureComponent<Props> {
  /**
   * Build an individual tab screen
   */
  buildTabScreen = (id: string, type: DOMString): React.ReactElement => {
    switch (type) {
      case NAVIGATOR_TYPE.TOP_TAB:
        return (
          <TopTab.Screen
            key={id}
            component={HvRoute}
            initialParams={{ id }}
            name={id}
          />
        );
      case NAVIGATOR_TYPE.BOTTOM_TAB:
        return (
          <BottomTab.Screen
            key={id}
            component={HvRoute}
            initialParams={{ id }}
            name={id}
          />
        );
      default:
    }
    throw new Errors.HvNavigatorError(`No navigator found for type '${type}'`);
  };

  /**
   * Build all screens from received routes
   */
  buildScreens = (element: Element, type: DOMString): React.ReactNode => {
    const screens: React.ReactElement[] = [];
    const navProps: NavigationContextProps | null = useContext(
      NavigationContext,
    );
    const navCache: NavigatorCache | null = useContext(NavigatorMapContext);
    if (!navProps || !navCache) {
      throw new Errors.HvRouteError('No context found');
    }

    const elements: Element[] = getChildElements(element);
    const { buildTabScreen } = this;
    for (let i = 0; i < elements.length; i += 1) {
      const child: Element = elements[i];
      if (child.localName === LOCAL_NAME.NAV_ROUTE) {
        const id: DOMString | null | undefined = child.getAttribute('id');
        if (!id) {
          throw new Errors.HvNavigatorError(
            `No id provided for ${child.localName}`,
          );
        }

        // Check for nested navigators
        const nestedNavigator: Element | null = getFirstTag(
          child,
          LOCAL_NAME.NAVIGATOR,
        );
        if (nestedNavigator) {
          // Cache the navigator for the route
          navCache.elementMap?.set(id, nestedNavigator);
        } else {
          const href: DOMString | null | undefined = child.getAttribute('href');
          if (!href) {
            throw new Errors.HvNavigatorError(
              `No href provided for route '${id}'`,
            );
          }
          const url = getUrlFromHref(href, navProps?.entrypointUrl);

          // Cache the url for the route
          navCache.routeMap?.set(id, url);
        }

        // Stack uses route urls, other types build out the screens
        if (type !== NAVIGATOR_TYPE.STACK) {
          screens.push(buildTabScreen(id, type));
        }
      }
    }

    // Add the dynamic screens
    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        // Dynamic is used to display all routes in stack which are presented as cards
        screens.push(
          <Stack.Screen
            key={ID_DYNAMIC}
            component={HvRoute}
            getId={({ params }) => params?.url}
            // empty object required because hv-screen doesn't check for undefined param
            initialParams={{}}
            name={ID_DYNAMIC}
          />,
        );

        // Modal is used to display all routes in stack which are presented as modals
        screens.push(
          <Stack.Screen
            key={ID_MODAL}
            component={HvRoute}
            getId={({ params }) => params?.url}
            // empty object required because hv-screen doesn't check for undefined param
            initialParams={{}}
            name={ID_MODAL}
            options={{ presentation: 'modal' }}
          />,
        );

        break;
      default:
    }
    return screens;
  };

  /**
   * Build the required navigator from the xml element
   */
  Navigator = (props: Props): React.ReactElement => {
    const id: DOMString | null | undefined = props.element.getAttribute('id');
    if (!id) {
      throw new Errors.HvNavigatorError('No id found for navigator');
    }

    const navProps: NavigationContextProps | null = useContext(
      NavigationContext,
    );
    const navCache: NavigatorCache | null = useContext(NavigatorMapContext);
    if (!navProps || !navCache) {
      throw new Errors.HvRouteError('No context found');
    }

    const type: DOMString | null | undefined = props.element.getAttribute(
      'type',
    );
    const initial: Element | undefined = getInitialNavRouteElement(
      props.element,
    );
    if (!initial) {
      throw new Errors.HvNavigatorError(`No initial route defined for '${id}'`);
    }

    const initialId: string | undefined = initial
      .getAttribute('id')
      ?.toString();
    if (initialId) {
      navCache.initialRouteName = initialId;
    }
    const { buildScreens } = this;
    switch (type) {
      case NAVIGATOR_TYPE.STACK:
        return (
          <Stack.Navigator
            id={id}
            initialRouteName={ID_DYNAMIC}
            screenOptions={({ route }) => ({
              header: undefined,
              headerMode: 'screen',
              headerShown: SHOW_NAVIGATION_UI,
              title: route.params?.url || id,
            })}
          >
            {buildScreens(props.element, type)}
          </Stack.Navigator>
        );
      case NAVIGATOR_TYPE.TOP_TAB:
        return (
          <TopTab.Navigator
            backBehavior="none"
            id={id}
            initialRouteName={initialId}
            screenOptions={{
              tabBarStyle: { display: SHOW_NAVIGATION_UI ? 'flex' : 'none' },
            }}
          >
            {buildScreens(props.element, type)}
          </TopTab.Navigator>
        );
      case NAVIGATOR_TYPE.BOTTOM_TAB:
        return (
          <BottomTab.Navigator
            backBehavior="none"
            id={id}
            initialRouteName={initialId}
            screenOptions={{
              headerShown: SHOW_NAVIGATION_UI,
              tabBarStyle: { display: SHOW_NAVIGATION_UI ? 'flex' : 'none' },
            }}
            tabBar={undefined}
          >
            {buildScreens(props.element, type)}
          </BottomTab.Navigator>
        );
      default:
    }
    throw new Errors.HvNavigatorError(
      `No navigator type '${type}'found for '${id}'`,
    );
  };

  render() {
    const { Navigator } = this;
    return (
      <NavigatorMapProvider>
        <Navigator element={this.props.element} />
      </NavigatorMapProvider>
    );
  }
}
