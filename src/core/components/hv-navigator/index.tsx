/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigatorMapContext from 'hyperview/src/contexts/navigator-map';
import * as NavigatorService from 'hyperview/src/services/navigator';
import { BEHAVIOR_ATTRIBUTES, LOCAL_NAME, TRIGGERS } from 'hyperview/src/types';
import {
  ParamTypes,
  Props,
  RouteParams,
  ScreenParams,
  StackScreenOptions,
  TabScreenOptions,
} from './types';
import React, { PureComponent } from 'react';
import { createCustomStackNavigator } from 'hyperview/src/core/components/navigator-stack';
import { createCustomTabNavigator } from 'hyperview/src/core/components/navigator-tab';
import { getFirstChildTag } from 'hyperview/src/services/dom/helpers';

/**
 * Flag to show the navigator UIs
 */
const SHOW_NAVIGATION_UI = false;

const Stack = createCustomStackNavigator<ParamTypes>();
const BottomTab = createCustomTabNavigator<ParamTypes>();

export default class HvNavigator extends PureComponent<Props> {
  /**
   * Encapsulated options for the stack screenOptions
   */
  stackScreenOptions = (route: ScreenParams): StackScreenOptions => ({
    headerMode: 'screen',
    headerShown: SHOW_NAVIGATION_UI,
    title: this.getId(route.params),
  });

  /**
   * Encapsulated options for the tab screenOptions
   */
  tabScreenOptions = (route: ScreenParams): TabScreenOptions => ({
    headerShown: SHOW_NAVIGATION_UI,
    tabBarStyle: { display: SHOW_NAVIGATION_UI ? 'flex' : 'none' },
    title: this.getId(route.params),
  });

  /**
   * Logic to determine the nav route id
   */
  getId = (params: RouteParams): string => {
    if (!params) {
      throw new NavigatorService.HvNavigatorError('No params found for route');
    }
    if (params.id) {
      if (NavigatorService.isDynamicRoute(params.id)) {
        // Dynamic routes use their url as id
        return params.url || params.id;
      }
      return params.id;
    }
    return params.url;
  };

  /**
   * Build an individual tab screen
   */
  buildScreen = (
    id: string,
    type: string,
    href: string | undefined,
    isModal: boolean,
  ): React.ReactElement => {
    const initialParams = NavigatorService.isDynamicRoute(id)
      ? {}
      : { id, isModal, url: href };
    if (type === NavigatorService.NAVIGATOR_TYPE.TAB) {
      return (
        <BottomTab.Screen
          key={id}
          component={this.props.routeComponent}
          initialParams={initialParams}
          name={id}
        />
      );
    }
    if (type === NavigatorService.NAVIGATOR_TYPE.STACK) {
      return (
        <Stack.Screen
          key={id}
          component={this.props.routeComponent}
          getId={({ params }: ScreenParams) => this.getId(params)}
          initialParams={initialParams}
          name={id}
          options={{
            cardStyleInterpolator: isModal
              ? NavigatorService.CardStyleInterpolators.forVerticalIOS
              : undefined,
            presentation: isModal
              ? NavigatorService.ID_MODAL
              : NavigatorService.ID_CARD,
          }}
        />
      );
    }
    throw new NavigatorService.HvNavigatorError(
      `No navigator found for type '${type}'`,
    );
  };

  /**
   * Build the card and modal screens for a stack navigator
   */
  buildDynamicScreens = (): React.ReactElement[] => {
    const screens: React.ReactElement[] = [];

    screens.push(
      this.buildScreen(
        NavigatorService.ID_CARD,
        NavigatorService.NAVIGATOR_TYPE.STACK,
        undefined,
        false,
      ),
    );

    screens.push(
      this.buildScreen(
        NavigatorService.ID_MODAL,
        NavigatorService.NAVIGATOR_TYPE.STACK,
        undefined,
        true,
      ),
    );
    return screens;
  };

  /**
   * Build all screens from received routes
   */
  buildScreens = (element: Element, type: string): React.ReactNode => {
    const screens: React.ReactElement[] = [];

    const elements: Element[] = NavigatorService.getChildElements(element);

    // For tab navigators, the screens are appended
    // For stack navigators, defined routes are appened,
    // the dynamic screens are added later
    // This iteration will also process nested navigators
    //    and retrieve additional urls from child routes
    elements.forEach((navRoute: Element) => {
      if (navRoute.localName === LOCAL_NAME.NAV_ROUTE) {
        const id: string | null | undefined = navRoute.getAttribute('id');
        if (!id) {
          throw new NavigatorService.HvNavigatorError(
            `No id provided for ${navRoute.localName}`,
          );
        }
        const href: string | null | undefined = navRoute.getAttribute('href');
        const isModal =
          navRoute.getAttribute(NavigatorService.KEY_MODAL) === 'true';

        // Check for nested navigators
        const nestedNavigator: Element | null = getFirstChildTag(
          navRoute,
          LOCAL_NAME.NAVIGATOR,
        );

        if (!nestedNavigator && !href) {
          throw new NavigatorService.HvNavigatorError(
            `No href provided for route '${id}'`,
          );
        }
        screens.push(this.buildScreen(id, type, href || undefined, isModal));
      }
    });

    // Add the dynamic stack screens
    if (type === NavigatorService.NAVIGATOR_TYPE.STACK) {
      screens.push(...this.buildDynamicScreens());
    }
    return screens;
  };

  /**
   * Build the required navigator from the xml element
   */
  Navigator = (): React.ReactElement => {
    if (!this.props.element) {
      throw new NavigatorService.HvNavigatorError(
        'No element found for navigator',
      );
    }

    const id: string | null | undefined = this.props.element.getAttribute('id');
    if (!id) {
      throw new NavigatorService.HvNavigatorError('No id found for navigator');
    }

    const type: string | null | undefined = this.props.element.getAttribute(
      'type',
    );
    const selected:
      | Element
      | undefined = NavigatorService.getSelectedNavRouteElement(
      this.props.element,
    );

    const selectedId: string | undefined = selected
      ? selected.getAttribute('id')?.toString()
      : undefined;

    switch (type) {
      case NavigatorService.NAVIGATOR_TYPE.STACK:
        return (
          <Stack.Navigator
            id={id}
            screenOptions={({ route }) => this.stackScreenOptions(route)}
          >
            {this.buildScreens(this.props.element, type)}
          </Stack.Navigator>
        );
      case NavigatorService.NAVIGATOR_TYPE.TAB:
        return (
          <BottomTab.Navigator
            backBehavior="none"
            id={id}
            initialRouteName={selectedId}
            screenOptions={({ route }) => this.tabScreenOptions(route)}
          >
            {this.buildScreens(this.props.element, type)}
          </BottomTab.Navigator>
        );
      default:
    }
    throw new NavigatorService.HvNavigatorError(
      `No navigator type '${type}'found for '${id}'`,
    );
  };

  /**
   * Build a stack navigator for a modal
   */
  ModalNavigator = (): React.ReactElement => {
    if (!this.props.params) {
      throw new NavigatorService.HvNavigatorError(
        'No params found for modal screen',
      );
    }

    if (!this.props.params.id) {
      throw new NavigatorService.HvNavigatorError(
        'No id found for modal screen',
      );
    }

    const id = `stack-${this.props.params.id}`;
    const screenId = `modal-screen-${this.props.params.id}`;

    // Generate a simple structure for the modal
    const screens: React.ReactElement[] = [];
    screens.push(
      this.buildScreen(
        screenId,
        NavigatorService.NAVIGATOR_TYPE.STACK,
        this.props.params?.url || undefined,
        false,
      ),
    );
    screens.push(...this.buildDynamicScreens());

    return (
      <Stack.Navigator
        id={id}
        screenOptions={({ route }) => this.stackScreenOptions(route)}
      >
        {screens}
      </Stack.Navigator>
    );
  };

  render() {
    return (
      <NavigatorMapContext.NavigatorMapProvider>
        {this.props.params && this.props.params.isModal ? (
          <this.ModalNavigator />
        ) : (
          <this.Navigator />
        )}
      </NavigatorMapContext.NavigatorMapProvider>
    );
  }
}
