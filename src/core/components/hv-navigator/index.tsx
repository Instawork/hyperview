/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorMapContext from 'hyperview/src/contexts/navigator-map';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import React, { PureComponent, useContext } from 'react';
import { getFirstTag } from 'hyperview/src/services/dom/helpers-legacy';

/**
 * Flag to show the navigator UIs
 */
const SHOW_NAVIGATION_UI = false;

const Stack = NavigatorService.createStackNavigator<Types.ParamTypes>();
const BottomTab = NavigatorService.createBottomTabNavigator();

export default class HvNavigator extends PureComponent<Types.Props> {
  /**
   * Build an individual tab screen
   */
  buildTabScreen = (
    id: string,
    type: TypesLegacy.DOMString,
  ): React.ReactElement => {
    if (type === NavigatorService.NAVIGATOR_TYPE.TAB) {
      return (
        <BottomTab.Screen
          key={id}
          component={this.props.routeComponent}
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
    const navigationContext: NavigationContext.NavigationContextProps | null = useContext(
      NavigationContext.Context,
    );
    const navigatorMapContext: NavigatorMapContext.NavigatorMapContextProps | null = useContext(
      NavigatorMapContext.NavigatorMapContext,
    );
    if (!navigationContext || !navigatorMapContext) {
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
    elements.forEach((navRoute: TypesLegacy.Element) => {
      if (navRoute.localName === TypesLegacy.LOCAL_NAME.NAV_ROUTE) {
        const id:
          | TypesLegacy.DOMString
          | null
          | undefined = navRoute.getAttribute('id');
        if (!id) {
          throw new NavigatorService.HvNavigatorError(
            `No id provided for ${navRoute.localName}`,
          );
        }

        // Check for nested navigators
        const nestedNavigator: TypesLegacy.Element | null = getFirstTag(
          navRoute,
          TypesLegacy.LOCAL_NAME.NAVIGATOR,
        );
        if (nestedNavigator) {
          // Cache the navigator for the route
          navigatorMapContext.setElement(id, nestedNavigator);
        } else {
          const href:
            | TypesLegacy.DOMString
            | null
            | undefined = navRoute.getAttribute('href');
          if (!href) {
            throw new NavigatorService.HvNavigatorError(
              `No href provided for route '${id}'`,
            );
          }
          const url = NavigatorService.getUrlFromHref(
            href,
            navigationContext?.entrypointUrl,
          );

          // Cache the url for the route by nav-route id
          navigatorMapContext.setRoute(id, url);
        }

        // 'stack' uses route urls, other types build out the screens
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
          component={this.props.routeComponent}
          getId={({ params }: Types.ScreenParams) => params.url}
          // empty object required because hv-screen doesn't check for undefined param
          initialParams={{}}
          name={NavigatorService.ID_DYNAMIC}
        />,
      );

      // Modal is used to display all routes in stack which are presented as modals
      screens.push(
        <Stack.Screen
          key={NavigatorService.ID_MODAL}
          component={this.props.routeComponent}
          getId={({ params }: Types.ScreenParams) => params.url}
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
  Navigator = (props: Types.Props): React.ReactElement => {
    const id:
      | TypesLegacy.DOMString
      | null
      | undefined = props.element.getAttribute('id');
    if (!id) {
      throw new NavigatorService.HvNavigatorError('No id found for navigator');
    }

    const navigationContext: NavigationContext.NavigationContextProps | null = useContext(
      NavigationContext.Context,
    );
    const navigatorMapContext: NavigatorMapContext.NavigatorMapContextProps | null = useContext(
      NavigatorMapContext.NavigatorMapContext,
    );
    if (!navigationContext || !navigatorMapContext) {
      throw new NavigatorService.HvRouteError('No context found');
    }

    const type:
      | TypesLegacy.DOMString
      | null
      | undefined = props.element.getAttribute('type');
    const selected:
      | TypesLegacy.Element
      | undefined = NavigatorService.getSelectedNavRouteElement(props.element);
    if (!selected) {
      throw new NavigatorService.HvNavigatorError(
        `No selected route defined for '${id}'`,
      );
    }

    const selectedId: string | undefined = selected
      .getAttribute('id')
      ?.toString();
    if (selectedId) {
      navigatorMapContext.initialRouteName = selectedId;
    }
    const { buildScreens } = this;
    switch (type) {
      case NavigatorService.NAVIGATOR_TYPE.STACK:
        return (
          <Stack.Navigator
            id={id}
            initialRouteName={NavigatorService.ID_DYNAMIC}
            screenOptions={({ route }: Types.NavigatorParams) => ({
              header: undefined,
              headerMode: 'screen',
              headerShown: SHOW_NAVIGATION_UI,
              title: route.params?.url || id,
            })}
          >
            {buildScreens(props.element, type)}
          </Stack.Navigator>
        );
      case NavigatorService.NAVIGATOR_TYPE.TAB:
        return (
          <BottomTab.Navigator
            backBehavior="none"
            id={id}
            initialRouteName={selectedId}
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
      <NavigatorMapContext.NavigatorMapProvider>
        <Navigator
          element={this.props.element}
          routeComponent={this.props.routeComponent}
        />
      </NavigatorMapContext.NavigatorMapProvider>
    );
  }
}
