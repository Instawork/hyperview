/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from './errors';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import * as UrlService from 'hyperview/src/services/url';
import { ANCHOR_ID_SEPARATOR } from './types';

/**
 * Get an array of all child elements of a node
 */
export const getChildElements = (
  element: TypesLegacy.Element,
): TypesLegacy.Element[] => {
  return (Array.from(element.childNodes) || []).filter(
    (child: TypesLegacy.Element) => {
      return child.nodeType === TypesLegacy.NODE_TYPE.ELEMENT_NODE;
    },
  );
};

/**
 * Determine if an element is a navigation element
 */
export const isNavigationElement = (element: TypesLegacy.Element): boolean => {
  return (
    element.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR ||
    element.localName === TypesLegacy.LOCAL_NAME.NAV_ROUTE
  );
};

/**
 * Get the route designated as 'initial' or the first route if none is marked
 */
export const getInitialNavRouteElement = (
  element: TypesLegacy.Element,
): TypesLegacy.Element | undefined => {
  const elements: TypesLegacy.Element[] = getChildElements(
    element,
  ).filter(child => isNavigationElement(child));

  if (!elements.length) {
    return undefined;
  }

  const initialChild = elements.find(
    child => child.getAttribute('initial')?.toLowerCase() === 'true',
  );

  return initialChild || elements[0];
};

/**
 * Determine if a url is a fragment
 */
export const isUrlFragment = (url: string): boolean => {
  return url.startsWith(ANCHOR_ID_SEPARATOR);
};

/**
 * Remove the leading '#' from a url fragment
 * Non-fragment urls are returned unchanged
 */
export const cleanHrefFragment = (url: string): string => {
  if (!isUrlFragment(url)) {
    return url;
  }
  return url.slice(1);
};

/**
 * Generate a complete url from the received fragment
 */
export const getUrlFromHref = (
  href: string | null | undefined,
  entrypointUrl: string | undefined,
): string => {
  return UrlService.getUrlFromHref(
    cleanHrefFragment(href || ''),
    entrypointUrl || '',
  );
};

/**
 * If the params contain a url, ensure that it is valid
 */
export const validateUrl = (
  action: TypesLegacy.NavAction,
  routeParams: TypesLegacy.NavigationRouteParams,
) => {
  if (
    action === TypesLegacy.NAV_ACTIONS.PUSH ||
    action === TypesLegacy.NAV_ACTIONS.NEW
  ) {
    if (!routeParams.url || !cleanHrefFragment(routeParams.url)) {
      throw new Errors.HvNavigatorError(
        `Route params must include a url for action '${action}'`,
      );
    }
  }
};

/**
 * Recurse through the route states to find the target
 * If the target is found, the path is generated to the first element
 * example: ['home', 'shifts', 'my-shifts']
 */
export const findPath = (
  state: Types.NavigationState,
  targetId: string,
): string[] => {
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
      ...findPath(route.state as Types.NavigationState, targetId),
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
export const getNavigatorAndPath = (
  targetId?: string,
  navigation?: Types.NavigationProp,
): [Types.NavigationProp?, string[]?] => {
  if (!targetId) {
    return [navigation, undefined];
  }
  if (navigation) {
    const path = findPath(navigation.getState(), targetId);
    if (path.length) {
      return [navigation, path];
    }
    return getNavigatorAndPath(targetId, navigation.getParent());
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
export const buildParams = (
  routeId: string,
  path: string[],
  routeParams: TypesLegacy.NavigationRouteParams,
  index = 0,
): Types.NavigationNavigateParams | TypesLegacy.NavigationRouteParams => {
  if (path.length && index < path.length) {
    const screen = path[index];

    if (!screen) {
      throw new Errors.HvNavigatorError('screen is undefined');
    }
    return {
      params: buildParams(routeId, path, routeParams, index + 1),
      screen,
    };
  }
  return {
    // The last screen in the path receives the route params
    // example: { url: 'someurl.xml' }
    params: routeParams,
    screen: routeId,
  };
};

/**
 * Use the dynamic or modal route for dynamic actions
 * isStatic represents a route which is already in the navigation state
 */
export const getRouteId = (
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

  if (url && isUrlFragment(url) && isStatic) {
    return cleanHrefFragment(url);
  }
  return Types.ID_DYNAMIC;
};

/**
 * Determine the action to perform based on the route params
 * Correct for a push action being introduced in
 * `this.getRouteKey(url);` in `hyperview/src/services/navigation`
 * Url fragments are treated as a navigate action
 */
export const getNavAction = (
  action: TypesLegacy.NavAction,
  routeParams?: TypesLegacy.NavigationRouteParams,
): TypesLegacy.NavAction => {
  if (
    routeParams &&
    routeParams.url &&
    action === TypesLegacy.NAV_ACTIONS.PUSH &&
    isUrlFragment(routeParams.url)
  ) {
    return TypesLegacy.NAV_ACTIONS.NAVIGATE;
  }
  return action;
};

/**
 * Build the request structure including finding the navigation,
 * building params, and determining screen id
 */
export const buildRequest = (
  nav: Types.NavigationProp | undefined,
  action: TypesLegacy.NavAction,
  routeParams?: TypesLegacy.NavigationRouteParams,
): [
  Types.NavigationProp | undefined,
  string,
  (
    | Types.NavigationNavigateParams
    | TypesLegacy.NavigationRouteParams
    | undefined
  ),
] => {
  if (!routeParams) {
    return [nav, '', {}];
  }

  // For a back behavior with params, the current navigator is targeted
  if (action === TypesLegacy.NAV_ACTIONS.BACK && routeParams.url) {
    return [nav, '', routeParams];
  }

  validateUrl(action, routeParams);

  const [navigation, path] = getNavigatorAndPath(routeParams.targetId, nav);
  if (!navigation) {
    return [undefined, '', routeParams];
  }

  // Static routes are those found in the current state. Tab navigators are always static.
  const isStatic: boolean =
    (path !== undefined && path.length > 0) ||
    navigation.getState().type !== Types.NAVIGATOR_TYPE.STACK;
  const routeId = getRouteId(action, routeParams.url, isStatic);

  if (!path || !path.length) {
    return [navigation, routeId, routeParams];
  }

  // The first path id the screen which will receive the initial request
  // remove from the path to avoid adding it in params so that it
  //  can be added to the navigation request
  // Example: navigate('home',
  //  { screen: 'shifts', params:
  //    { screen: 'my-shifts', params: { url: 'someurl.xml' } } })
  const lastPathId = path.shift();
  const params:
    | Types.NavigationNavigateParams
    | TypesLegacy.NavigationRouteParams = buildParams(
    routeId,
    path,
    routeParams,
  );

  return [navigation, lastPathId || routeId, params];
};
