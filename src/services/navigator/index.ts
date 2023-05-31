/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CommonActions, NavigationState, StackActions } from './imports';
import {
  ID_DYNAMIC,
  ID_MODAL,
  NAVIGATOR_TYPE,
  NavigationNavigateParams,
} from './types';
import {
  NAV_ACTIONS,
  NavAction,
  NavigationRouteParams,
} from 'hyperview/src/types-legacy';
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
   * Recursively search down the navigation path for the target in state and build a path to it
   */
  findPath = (state: NavigationState, targetId: string, path: string[]) => {
    const { routes } = state;
    if (routes) {
      for (let i = 0; i < routes.length; i += 1) {
        const route = routes[i];

        if (route.name === targetId) {
          path.push(route.name);
        } else if (route.state) {
          const routeState = route.state as NavigationState;
          if (routeState) {
            this.findPath(routeState, targetId, path);
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
    targetId?: string,
  ): [RNTypedNavigationProps?, string[]?] => {
    let { navigation } = this.props;
    if (!targetId) {
      return [navigation, undefined];
    }

    while (navigation) {
      const path: string[] = [];
      const state = navigation.getState();
      this.findPath(state, targetId, path);
      if (path.length) {
        return [navigation, path];
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
  ): NavigationNavigateParams | NavigationRouteParams => {
    let param: NavigationNavigateParams;
    if (path.length) {
      const screen = path.pop();
      if (!screen) {
        throw new Error('screen is undefined');
      }
      param = { screen };
      param.params = this.buildParams(routeId, path, routeParams);
    } else {
      param = { screen: routeId };
      // The last screen in the path receives the route params
      param.params = routeParams;
    }
    return param;
  };

  /**
   * Use the dynamic or modal route for dynamic actions
   */
  getRouteId = (
    action: NavAction,
    url: string | undefined,
    isStatic: boolean,
  ): string => {
    switch (action) {
      case NAV_ACTIONS.PUSH:
        return ID_DYNAMIC;
      case NAV_ACTIONS.NEW:
        return ID_MODAL;
      default:
    }

    if (url && isUrlFragment(url)) {
      // Fragments get cleaned
      const routeId = cleanHrefFragment(url);
      if (isStatic) {
        // If the route exists in a navigator, use it, otherwise use dynamic
        return routeId;
      }
      return ID_DYNAMIC;
    }
    return ID_DYNAMIC;
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
    NavigationNavigateParams | NavigationRouteParams | undefined,
  ] => {
    // For a back behavior with params, the current navigator is targeted
    if (action === NAV_ACTIONS.BACK && routeParams.url) {
      return [this.props.navigation, '', routeParams];
    }

    const [navigation, path] = this.getNavigatorAndPath(routeParams.targetId);
    if (!navigation) {
      return [undefined, '', undefined];
    }

    // Clean up the params to remove the target and url if they are not needed
    const cleanedParams: NavigationRouteParams = { ...routeParams };
    delete cleanedParams.targetId;

    const hasPath: boolean = path !== undefined && path.length > 0;
    let routeId = this.getRouteId(action, routeParams.url, hasPath);

    let params: NavigationNavigateParams | NavigationRouteParams;
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
   * Process the request by changing params before going back
   * Only the current navigator is targeted
   * If the navigator is not type stack, the back request is bubbled
   */
  // eslint-disable-next-line class-methods-use-this
  routeBackRequest(
    navigation: RNTypedNavigationProps,
    routeParams: NavigationRouteParams,
  ) {
    const state = navigation.getState();

    if (state.type === NAVIGATOR_TYPE.STACK && state.index > 0) {
      const prev = state.routes[state.index - 1];

      navigation.dispatch({
        ...CommonActions.setParams({
          ...routeParams,
        }),
        source: prev.key,
        target: state.key,
      });
    }
    navigation.goBack();
  }

  /**
   * Prepare and send the request
   */
  sendRequest = (action: NavAction, routeParams: NavigationRouteParams) => {
    let { navigation } = this.props;
    let routeId: string | undefined;
    let params: NavigationNavigateParams | NavigationRouteParams | undefined;
    let navAction: NavAction = action;

    if (routeParams) {
      // The push action is used for urls which are not associated with a route
      // See use of `this.getRouteKey(url);` in `hyperview/src/services/navigation`
      if (routeParams.url) {
        if (navAction === NAV_ACTIONS.PUSH && isUrlFragment(routeParams.url)) {
          navAction = NAV_ACTIONS.NAVIGATE;
        }
      }

      const [
        requestNavigation,
        requestRouteId,
        requestParams,
      ] = this.buildRequest(navAction, routeParams || {});

      navigation = requestNavigation;
      routeId = requestRouteId;
      params = requestParams;
    }

    if (!navigation) {
      return;
    }

    switch (navAction) {
      case NAV_ACTIONS.BACK:
        if (routeParams) {
          this.routeBackRequest(navigation, routeParams);
        } else {
          navigation.goBack();
        }
        break;
      case NAV_ACTIONS.CLOSE:
        navigation.goBack();
        break;
      case NAV_ACTIONS.NAVIGATE:
        if (routeId) {
          navigation.dispatch(CommonActions.navigate(routeId, params));
        }
        break;
      case NAV_ACTIONS.NEW:
        if (routeId) {
          navigation.dispatch(CommonActions.navigate(routeId, params));
        }
        break;
      case NAV_ACTIONS.PUSH:
        if (routeId) {
          navigation.dispatch(StackActions.push(routeId, params));
        }
        break;
      default:
    }
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
