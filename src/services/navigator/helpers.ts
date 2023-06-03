/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from './errors';
import * as HvRoute from 'hyperview/src/core/components/hv-route';
import * as Imports from './imports';
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
 * Get the route designated as 'initial' or the first route if none is marked
 */
export const getInitialNavRouteElement = (
  element: TypesLegacy.Element,
): TypesLegacy.Element | undefined => {
  let firstNavChild: TypesLegacy.Element | undefined;
  let initialChild: TypesLegacy.Element | undefined;
  const elements: TypesLegacy.Element[] = getChildElements(element);
  elements.every((child: TypesLegacy.Element) => {
    if (
      child.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR ||
      child.localName === TypesLegacy.LOCAL_NAME.NAV_ROUTE
    ) {
      if (
        !initialChild &&
        child.getAttribute('initial')?.toLowerCase() === 'true'
      ) {
        initialChild = child;
      }
      if (!initialChild && !firstNavChild) {
        firstNavChild = child;
      }
    }

    if (initialChild) {
      return false;
    }
    return true;
  });
  return initialChild || firstNavChild;
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
  if (!href) {
    return entrypointUrl || '';
  }
  return UrlService.getUrlFromHref(
    cleanHrefFragment(href),
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
  if (action === TypesLegacy.NAV_ACTIONS.PUSH || TypesLegacy.NAV_ACTIONS.NEW) {
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
  state: Imports.NavigationState,
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
      ...findPath(route.state as Imports.NavigationState, targetId),
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
  navigation?: HvRoute.RNTypedNavigationProps,
): [HvRoute.RNTypedNavigationProps?, string[]?] => {
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
  let param: Types.NavigationNavigateParams;
  if (path.length && index < path.length) {
    const screen = path[index];

    if (!screen) {
      throw new Errors.HvNavigatorError('screen is undefined');
    }
    param = { screen };
    param.params = buildParams(routeId, path, routeParams, index + 1);
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
