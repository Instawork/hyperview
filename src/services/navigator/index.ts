/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from './errors';
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
   * Recurse through the route states to find the target
   * If the target is found, the path is generated to the first element
   * example: ['home', 'shifts', 'my-shifts']
   */
  findPath = (state: Imports.NavigationState, targetId: string): string[] => {
    let path: string[] = [];
    if (!state) {
      return path;
    }
    const { routes } = state;
    if (!routes) {
      return path;
    }
    routes.every(route => {
      if (route.name === targetId) {
        path.unshift(route.name);
        return false;
      }
      path = [
        ...path,
        ...this.findPath(route.state as Imports.NavigationState, targetId),
      ];
      // If the recursion found the target, add the current route name to the path as we back out
      if (path.length) {
        path.unshift(route.name);
        return false;
      }
      return true;
    });
    return path;
  };

  /**
   * Continue up the hierarchy until a navigation is found which contains the target
   * If the target is not found, no navigation is returned
   * If no target is provided, the current navigation is returned
   */
  getNavigatorAndPath = (
    targetId?: string,
    navigation?: HvRoute.RNTypedNavigationProps,
  ): [HvRoute.RNTypedNavigationProps?, string[]?] => {
    if (!targetId) {
      return [this.props.navigation, undefined];
    }
    if (navigation) {
      const path = this.findPath(navigation.getState(), targetId);
      if (path.length) {
        return [navigation, path];
      }
      return this.getNavigatorAndPath(targetId, navigation.getParent());
    }
    return [undefined, undefined];
  };

  /**
   * Generate a nested param hierarchy with instructions for each screen
   * to step through to the target
   * example: { screen: 'home', params:
   *    { screen: 'shifts', params:
   *        { screen: 'my-shifts', params:
   *            { url: 'someurl.xml' } } } }
   */
  buildParams = (
    routeId: string,
    path: string[],
    routeParams: TypesLegacy.NavigationRouteParams,
    index = 0,
  ): Types.NavigationNavigateParams | TypesLegacy.NavigationRouteParams => {
    let param: Types.NavigationNavigateParams;
    if (path.length && index < path.length) {
      const screen = path[index];

      if (!screen) {
        throw new Errors.HvNavigatorError('screen is undefined');
      }
      param = { screen };
      param.params = this.buildParams(routeId, path, routeParams, index + 1);
    } else {
      param = { screen: routeId };
      // The last screen in the path receives the route params
      // example: { url: 'someurl.xml' }
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

    if (url && Helpers.isUrlFragment(url) && isStatic) {
      return Helpers.cleanHrefFragment(url);
    }
    return Types.ID_DYNAMIC;
  };

  validateUrl = (
    action: TypesLegacy.NavAction,
    routeParams: TypesLegacy.NavigationRouteParams,
  ) => {
    if (
      action === TypesLegacy.NAV_ACTIONS.PUSH ||
      TypesLegacy.NAV_ACTIONS.NEW
    ) {
      if (!routeParams.url || !Helpers.cleanHrefFragment(routeParams.url)) {
        throw new Errors.HvNavigatorError(
          `Route params must include a url for action '${action}'`,
        );
      }
    }
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

    this.validateUrl(action, routeParams);

    const [navigation, path] = this.getNavigatorAndPath(
      routeParams.targetId,
      this.props.navigation,
    );
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
      // The first path id is the screen id, remove from the path to avoid adding it in params
      const lastPathId = path.shift();
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
export {
  isUrlFragment,
  cleanHrefFragment,
  getChildElements,
  getInitialNavRouteElement,
  getUrlFromHref,
} from './helpers';
export { ID_DYNAMIC, ID_MODAL, NAVIGATOR_TYPE } from './types';
