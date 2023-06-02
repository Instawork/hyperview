/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Helpers from './helpers';
import * as HvRoute from 'hyperview/src/core/components/hv-route';
import * as Imports from './imports';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types-legacy';

/**
 * Provide navigation action implementations
 */
export class Navigator {
  props: HvRoute.Props;

  constructor(props: HvRoute.Props) {
    this.props = props;
  }

  /**
   * Recursively search down the navigation path for the target in state and build a path to it
   */
  findPath = (
    state: Imports.NavigationState,
    targetId: string,
    path: string[],
  ) => {
    const { routes } = state;
    if (routes) {
      routes.every(route => {
        if (route.name === targetId) {
          path.push(route.name);
        } else if (route.state) {
          const routeState = route.state as Imports.NavigationState;
          if (routeState) {
            this.findPath(routeState, targetId, path);
            if (path.length) {
              path.push(route.name);
            }
          }
        }
        if (path.length) {
          return false;
        }
        return true;
      });
    }
  };

  /**
   * Continue up the hierarchy until a navigation is found which contains the target
   * If the target is not found, no navigation is returned
   */
  getNavigatorAndPath = (
    targetId?: string,
  ): [HvRoute.RNTypedNavigationProps?, string[]?] => {
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
    routeParams: TypesLegacy.NavigationRouteParams,
  ): Types.NavigationNavigateParams | TypesLegacy.NavigationRouteParams => {
    let param: Types.NavigationNavigateParams;
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
    action: TypesLegacy.NavAction,
    url: string | undefined,
    isStatic: boolean,
  ): string => {
    if (action === TypesLegacy.NAV_ACTIONS.PUSH) {
      return Types.ID_DYNAMIC;
    }
    if (action === TypesLegacy.NAV_ACTIONS.NEW) {
      return Types.ID_MODAL;
    }

    // If the passed url is a fragment, and it is a non-dynamic route, the id is cleaned
    if (url && Helpers.isUrlFragment(url) && isStatic) {
      return Helpers.cleanHrefFragment(url);
    }
    return Types.ID_DYNAMIC;
  };

  /**
   * Build the request structure including finding the navigation,
   * building params, and determining screen id
   */
  buildRequest = (
    action: TypesLegacy.NavAction,
    routeParams: TypesLegacy.NavigationRouteParams,
  ): [
    HvRoute.RNTypedNavigationProps | undefined,
    string,
    (
      | Types.NavigationNavigateParams
      | TypesLegacy.NavigationRouteParams
      | undefined
    ),
  ] => {
    // For a back behavior with params, the current navigator is targeted
    if (action === TypesLegacy.NAV_ACTIONS.BACK && routeParams.url) {
      return [this.props.navigation, '', routeParams];
    }

    const [navigation, path] = this.getNavigatorAndPath(routeParams.targetId);
    if (!navigation) {
      return [undefined, '', undefined];
    }

    const hasPath: boolean = path !== undefined && path.length > 0;
    let routeId = this.getRouteId(action, routeParams.url, hasPath);

    let params:
      | Types.NavigationNavigateParams
      | TypesLegacy.NavigationRouteParams;
    if (!path || !path.length) {
      params = routeParams;
    } else {
      // The last path id is the screen id, remove from the path to avoid adding it in params
      const lastPathId = path.pop();
      params = this.buildParams(routeId, path, routeParams);
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
  static routeBackRequest(
    navigation: HvRoute.RNTypedNavigationProps,
    routeParams?: TypesLegacy.NavigationRouteParams,
  ) {
    const state = navigation.getState();

    if (
      routeParams &&
      state.type === Types.NAVIGATOR_TYPE.STACK &&
      state.index > 0
    ) {
      const prev = state.routes[state.index - 1];

      navigation.dispatch({
        ...Imports.CommonActions.setParams({
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
  sendRequest = (
    action: TypesLegacy.NavAction,
    routeParams?: TypesLegacy.NavigationRouteParams,
  ) => {
    let { navigation } = this.props;
    let routeId: string | undefined;
    let params:
      | Types.NavigationNavigateParams
      | TypesLegacy.NavigationRouteParams
      | undefined;
    let navAction: TypesLegacy.NavAction = action;

    if (routeParams) {
      // The push action is used for urls which are not associated with a route
      // See use of `this.getRouteKey(url);` in `hyperview/src/services/navigation`
      if (routeParams.url) {
        if (
          navAction === TypesLegacy.NAV_ACTIONS.PUSH &&
          Helpers.isUrlFragment(routeParams.url)
        ) {
          navAction = TypesLegacy.NAV_ACTIONS.NAVIGATE;
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
      if (routeParams?.targetId) {
        console.warn(
          `No navigation found for target '${routeParams.targetId}'`,
        );
      }
      return;
    }

    switch (navAction) {
      case TypesLegacy.NAV_ACTIONS.BACK:
      case TypesLegacy.NAV_ACTIONS.CLOSE:
        Navigator.routeBackRequest(navigation, routeParams);
        break;
      case TypesLegacy.NAV_ACTIONS.NAVIGATE:
      case TypesLegacy.NAV_ACTIONS.NEW:
        if (routeId) {
          navigation.dispatch(Imports.CommonActions.navigate(routeId, params));
        }
        break;
      case TypesLegacy.NAV_ACTIONS.PUSH:
        if (routeId) {
          navigation.dispatch(Imports.StackActions.push(routeId, params));
        }
        break;
      default:
    }
  };

  back = (params: TypesLegacy.NavigationRouteParams | undefined) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.BACK, params);
  };

  closeModal = (params: TypesLegacy.NavigationRouteParams | undefined) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.CLOSE, params);
  };

  navigate = (params: TypesLegacy.NavigationRouteParams) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.NAVIGATE, params);
  };

  openModal = (params: TypesLegacy.NavigationRouteParams) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.NEW, params);
  };

  push = (params: TypesLegacy.NavigationRouteParams) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.PUSH, params);
  };
}

export type { NavigationProp, Route } from './imports';
export {
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from './imports';
export { HvRouteError, HvNavigatorError, HvRenderError } from './errors';
export { Route as Render } from './render';
export {
  isUrlFragment,
  cleanHrefFragment,
  getChildElements,
  getInitialNavRouteElement,
  getUrlFromHref,
} from './helpers';
export { ID_DYNAMIC, ID_MODAL, NAVIGATOR_TYPE } from './types';
