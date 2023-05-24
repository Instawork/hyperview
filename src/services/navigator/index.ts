/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  ID_DYNAMIC,
  ID_MODAL,
  NAVIGATOR_TYPE,
  NAV_ACTIONS,
  NavAction,
  NavigationRouteParams,
} from './types';
import { NavigationState, ParamListBase } from './imports';
import {
  Props,
  RNTypedNavigationProps,
} from 'hyperview/src/core/components/hv-route/types';
import {
  cleanHrefFragment,
  isUrlFragment,
} from 'hyperview/src/services/navigator/helpers';

/**
 * Provide navigation action implementations
 */
export class Logic {
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  /**
   * Recursively search for the target in state and build a path to it
   */
  findPath = (
    state: NavigationState,
    targetRouteId: string,
    path: string[],
  ) => {
    const { routes } = state;
    if (routes) {
      for (let i = 0; i < routes.length; i += 1) {
        const route = routes[i];

        if (route.name === targetRouteId) {
          path.push(route.name);
        } else if (route.state) {
          const routeState = route.state as NavigationState;
          if (routeState) {
            this.findPath(routeState, targetRouteId, path);
            if (path.length) {
              path.push(route.name);
            }
          }
        }
        if (path.length) {
          break;
        }
      }
    }
  };

  /**
   * Continue up the hierarchy until a navigation is found which contains the target
   * If the target is not found, no navigation is returned
   */
  getNavigatorAndPath = (
    action: NavAction,
    targetRouteId?: string,
  ): [RNTypedNavigationProps?, string[]?] => {
    let { navigation } = this.props;
    while (navigation) {
      const path: string[] = [];
      const state = navigation.getState();
      const { type } = state;
      if (targetRouteId) {
        // Find for the specific target
        this.findPath(state, targetRouteId, path);
        if (path.length) {
          return [navigation, path];
        }
      } else {
        // Find for the action
        switch (action) {
          case NAV_ACTIONS.NEW:
          case NAV_ACTIONS.PUSH:
            if (type === NAVIGATOR_TYPE.STACK) {
              return [navigation, undefined];
            }
            break;
          default:
        }
      }
      navigation = navigation.getParent();
    }
    return [undefined, undefined];
  };

  /**
   * Generate a nested param hierarchy with instructions for each screen
   * to step through to the target
   */
  buildParams = (
    routeId: string,
    path: string[],
    routeParams: NavigationRouteParams,
  ): ParamListBase => {
    const prms: ParamListBase = {};
    if (path.length) {
      prms.screen = path.pop();
      prms.params = this.buildParams(routeId, path, routeParams);
    } else {
      prms.screen = routeId;
      // The last screen in the path receives the route params
      prms.params = routeParams;
    }
    return prms;
  };

  /**
   * Check if a navigation component contains a route by name
   */
  navigationContainsRoute = (
    navigation: RNTypedNavigationProps,
    routeId: string,
  ): boolean => {
    if (!navigation) {
      return false;
    }
    const { routes } = navigation.getState();
    for (let i = 0; i < routes.length; i += 1) {
      const route = routes[i];
      if (route.name === routeId) {
        return true;
      }
    }
    return false;
  };

  /**
   * Create a virtual for urls which are not associated with a route
   */
  getVirtualScreenId = (
    navigation: RNTypedNavigationProps,
    action: NavAction,
    routeId: string,
  ): string => {
    if (routeId && !isUrlFragment(routeId)) {
      let id: string | undefined;
      switch (action) {
        case NAV_ACTIONS.NAVIGATE:
        case NAV_ACTIONS.PUSH:
          id = ID_DYNAMIC;
          break;
        case NAV_ACTIONS.NEW:
          id = ID_MODAL;
          break;
        default:
      }
      if (id && this.navigationContainsRoute(navigation, id)) {
        return id;
      }
    }
    return routeId;
  };

  /**
   * Build the request structure including finding the navigation,
   * building params, and determining screen id
   */
  buildRequest = (
    action: NavAction,
    routeParams: NavigationRouteParams,
  ): [
    RNTypedNavigationProps | undefined,
    string,
    ParamListBase | undefined,
  ] => {
    const [navigation, path] = this.getNavigatorAndPath(
      action,
      routeParams.target,
    );
    if (!navigation) {
      return [undefined, '', undefined];
    }

    // Clean up the params to remove the target and url if they are not needed
    const cleanedParams: NavigationRouteParams = { ...routeParams };
    delete cleanedParams.target;
    if (cleanedParams.url && isUrlFragment(cleanedParams.url)) {
      delete cleanedParams.url;
    }

    let routeId = cleanHrefFragment(
      this.getVirtualScreenId(navigation, action, routeParams.url),
    );
    let params: ParamListBase;
    if (!path || !path.length) {
      params = cleanedParams;
    } else {
      // The last path id is the screen id, remove from the path to avoid adding it in params
      const lastPathId = path.pop();
      params = this.buildParams(routeId, path, cleanedParams);
      if (lastPathId) {
        routeId = lastPathId;
      }
    }

    return [navigation, routeId, params];
  };

  /**
   * Prepare and send the request
   */
  sendRequest = (action: NavAction, routeParams: NavigationRouteParams) => {
    // this.props.navigation?.navigate(ID_MODAL, {
    //   url: '#help-route',
    // });

    let { navigation } = this.props;
    let routeId: string | undefined;
    let requestParams: ParamListBase | undefined;

    // console.log('sendRequest', action, routeParams);

    if (routeParams) {
      const [requestNavigation, requestRouteId, params] = this.buildRequest(
        action,
        routeParams || {},
      );

      navigation = requestNavigation;
      routeId = requestRouteId;
      requestParams = params;
    }

    if (!navigation) {
      return;
    }

    // navigation.navigate(ID_DYNAMIC, { url: '#help-route' });

    // switch (action) {
    //   case NAV_ACTIONS.BACK:
    //     // USE NAVIGATION IF A PATH IS PRESENT // navigation.navigate(routeId, requestParams);
    //     navigation.goBack();
    //     break;
    //   case NAV_ACTIONS.CLOSE:
    //     navigation.goBack();
    //     break;
    //   case NAV_ACTIONS.NAVIGATE:
    //     navigation.navigate(routeId, requestParams);
    //     break;
    //   case NAV_ACTIONS.NEW:
    //     // navigation.navigate(routeId, requestParams);
    //     navigation.navigate((screen = 'Modal'));
    //     break;
    //   case NAV_ACTIONS.PUSH:
    //     navigation.push(routeId, requestParams);
    //     break;
    //   default:
    // }
    console.log(
      'sendRequest',
      action,
      routeParams,
      navigation,
      routeId,
      requestParams,
    );

    navigation.navigate(routeId, requestParams);
  };

  back = (routeParams: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.BACK, routeParams);
  };

  closeModal = (routeParams: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.CLOSE, routeParams);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  navigate = (routeParams: NavigationRouteParams, _: string) => {
    this.sendRequest(NAV_ACTIONS.NAVIGATE, routeParams);
  };

  openModal = (routeParams: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.NEW, routeParams);
  };

  push = (routeParams: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.PUSH, routeParams);
  };
}
