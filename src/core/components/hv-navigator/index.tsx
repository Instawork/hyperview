/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorContext from 'hyperview/src/contexts/navigator';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import HvRoute, { RouteParams } from 'hyperview/src/core/components/hv-route';
import React, { PureComponent, useContext } from 'react';
import { Props } from './types';
import { getFirstTag } from 'hyperview/src/services/dom/helpers-legacy';

type ParamTypes = {
  dynamic: RouteParams;
  modal: RouteParams;
};

/**
 * Flag to show the navigator UIs
 */
const SHOW_NAVIGATION_UI = true;

const Stack = NavigatorService.createStackNavigator<ParamTypes>();
const BottomTab = NavigatorService.createBottomTabNavigator();
const TopTab = NavigatorService.createMaterialTopTabNavigator();

export default class HvNavigator extends PureComponent<Props> {
  /**
   * Build an individual tab screen
   */
  buildTabScreen = (
    id: string,
    type: TypesLegacy.DOMString,
  ): React.ReactElement => {
    if (type === NavigatorService.NAVIGATOR_TYPE.TOP_TAB) {
      return (
        <TopTab.Screen
          key={id}
          component={HvRoute}
          initialParams={{ id }}
          name={id}
        />
      );
    }
    if (type === NavigatorService.NAVIGATOR_TYPE.BOTTOM_TAB) {
      return (
        <BottomTab.Screen
          key={id}
          component={HvRoute}
          initialParams={{ id }}
          name={id}
        />
      );
    }
    throw new NavigatorService.HvNavigatorError(
      `No navigator found for type '${type}'`,
    );
  };

  /**
   * Build all screens from received routes
   */
  buildScreens = (
    element: TypesLegacy.Element,
    type: TypesLegacy.DOMString,
  ): React.ReactNode => {
    const screens: React.ReactElement[] = [];
    const navProps: NavigationContext.NavigationContextProps | null = useContext(
      NavigationContext.Context,
    );
    const navCache: NavigatorContext.NavigatorCache | null = useContext(
      NavigatorContext.NavigatorMapContext,
    );
    if (!navProps || !navCache) {
      throw new NavigatorService.HvRouteError('No context found');
    }

    const { buildTabScreen } = this;
    const elements: TypesLegacy.Element[] = NavigatorService.getChildElements(
      element,
    );

    // For tab navigators, the screens are appended
    // For stack navigators, the dynamic screens are added later
    // This iteration will also process nested navigators
    //    and retrieve additional urls from child routes
    elements.forEach((child: TypesLegacy.Element) => {
      if (child.localName === TypesLegacy.LOCAL_NAME.NAV_ROUTE) {
        const id: TypesLegacy.DOMString | null | undefined = child.getAttribute(
          'id',
        );
        if (!id) {
          throw new NavigatorService.HvNavigatorError(
            `No id provided for ${child.localName}`,
          );
        }

        // Check for nested navigators
        const nestedNavigator: TypesLegacy.Element | null = getFirstTag(
          child,
          TypesLegacy.LOCAL_NAME.NAVIGATOR,
        );
        if (nestedNavigator) {
          // Cache the navigator for the route
          navCache.elementMap?.set(id, nestedNavigator);
        } else {
          const href:
            | TypesLegacy.DOMString
            | null
            | undefined = child.getAttribute('href');
          if (!href) {
            throw new NavigatorService.HvNavigatorError(
              `No href provided for route '${id}'`,
            );
          }
          const url = NavigatorService.getUrlFromHref(
            href,
            navProps?.entrypointUrl,
          );

          // Cache the url for the route
          navCache.routeMap?.set(id, url);
        }

        // Stack uses route urls, other types build out the screens
        if (type !== NavigatorService.NAVIGATOR_TYPE.STACK) {
          screens.push(buildTabScreen(id, type));
        }
      }
    });

    // Add the dynamic stack screens
    if (type === NavigatorService.NAVIGATOR_TYPE.STACK) {
      // Dynamic is used to display all routes in stack which are presented as cards
      screens.push(
        <Stack.Screen
          key={NavigatorService.ID_DYNAMIC}
          component={HvRoute}
          getId={({ params }) => params?.url}
          // empty object required because hv-screen doesn't check for undefined param
          initialParams={{}}
          name={NavigatorService.ID_DYNAMIC}
        />,
      );

      // Modal is used to display all routes in stack which are presented as modals
      screens.push(
        <Stack.Screen
          key={NavigatorService.ID_MODAL}
          component={HvRoute}
          getId={({ params }) => params?.url}
          // empty object required because hv-screen doesn't check for undefined param
          initialParams={{}}
          name={NavigatorService.ID_MODAL}
          options={{ presentation: 'modal' }}
        />,
      );
    }
    return screens;
  };

  /**
   * Build the required navigator from the xml element
   */
  Navigator = (props: Props): React.ReactElement => {
    const id:
      | TypesLegacy.DOMString
      | null
      | undefined = props.element.getAttribute('id');
    if (!id) {
      throw new NavigatorService.HvNavigatorError('No id found for navigator');
    }

    const navProps: NavigationContext.NavigationContextProps | null = useContext(
      NavigationContext.Context,
    );
    const navCache: NavigatorContext.NavigatorCache | null = useContext(
      NavigatorContext.NavigatorMapContext,
    );
    if (!navProps || !navCache) {
      throw new NavigatorService.HvRouteError('No context found');
    }

    const type:
      | TypesLegacy.DOMString
      | null
      | undefined = props.element.getAttribute('type');
    const initial:
      | TypesLegacy.Element
      | undefined = NavigatorService.getInitialNavRouteElement(props.element);
    if (!initial) {
      throw new NavigatorService.HvNavigatorError(
        `No initial route defined for '${id}'`,
      );
    }

    const initialId: string | undefined = initial
      .getAttribute('id')
      ?.toString();
    if (initialId) {
      navCache.initialRouteName = initialId;
    }
    const { buildScreens } = this;
    switch (type) {
      case NavigatorService.NAVIGATOR_TYPE.STACK:
        return (
          <Stack.Navigator
            id={id}
            initialRouteName={NavigatorService.ID_DYNAMIC}
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
      case NavigatorService.NAVIGATOR_TYPE.TOP_TAB:
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
      case NavigatorService.NAVIGATOR_TYPE.BOTTOM_TAB:
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
    throw new NavigatorService.HvNavigatorError(
      `No navigator type '${type}'found for '${id}'`,
    );
  };

  render() {
    const { Navigator } = this;
    return (
      <NavigatorContext.NavigatorMapProvider>
        <Navigator element={this.props.element} />
      </NavigatorContext.NavigatorMapProvider>
    );
  }
}
