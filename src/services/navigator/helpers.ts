/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from './errors';
import * as Helpers from 'hyperview/src/services/dom/helpers-legacy';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import * as UrlService from 'hyperview/src/services/url';
import { ANCHOR_ID_SEPARATOR } from './types';

/**
 * Card and modal routes are not defined in the document
 */
export const isDynamicRoute = (id: string): boolean => {
  return id === Types.ID_CARD || id === Types.ID_MODAL;
};

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
    element.namespaceURI === Namespaces.HYPERVIEW &&
    (element.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR ||
      element.localName === TypesLegacy.LOCAL_NAME.NAV_ROUTE)
  );
};

/**
 * Get the route designated as 'selected'
 */
export const getSelectedNavRouteElement = (
  element: TypesLegacy.Element,
): TypesLegacy.Element | undefined => {
  const elements: TypesLegacy.Element[] = getChildElements(
    element,
  ).filter(child => isNavigationElement(child));

  if (!elements.length) {
    return undefined;
  }

  const selectedChild = elements.find(
    child => child.getAttribute('selected') === 'true',
  );

  return selectedChild;
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

  if (!state.routes) {
    return path;
  }
  state.routes.every(route => {
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
 * Use the card or modal route for dynamic actions, otherwise use the given id
 */
export const getRouteId = (
  action: TypesLegacy.NavAction,
  url: string | undefined,
): string => {
  if (url && isUrlFragment(url)) {
    return cleanHrefFragment(url);
  }

  return action === TypesLegacy.NAV_ACTIONS.NEW
    ? Types.ID_MODAL
    : Types.ID_CARD;
};

/**
 * Search for a route with the given id
 */
export const getRouteById = (
  doc: TypesLegacy.Document,
  id: string,
): TypesLegacy.Element | undefined => {
  const routes = doc
    .getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      TypesLegacy.LOCAL_NAME.NAV_ROUTE,
    )
    .filter((n: TypesLegacy.Element) => {
      return n.getAttribute('id') === id;
    });
  return routes && routes.length > 0 ? routes[0] : undefined;
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

  const cleanedParams: TypesLegacy.NavigationRouteParams = { ...routeParams };
  if (cleanedParams.url && isUrlFragment(cleanedParams.url)) {
    // When a fragment is used, the original url is used for the route
    // setting url to undefined will overwrite the value, so the url has to be
    // deleted to allow merging the params while retaining the original url
    delete cleanedParams.url;
  }

  if (!navigation) {
    return [undefined, '', cleanedParams];
  }

  const routeId = getRouteId(action, routeParams.url);

  if (!path || !path.length) {
    return [navigation, routeId, cleanedParams];
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
    cleanedParams,
  );

  return [navigation, lastPathId || routeId, params];
};

/**
 * Create a map of <id, element> from a list of nodes
 */
const nodesToMap = (
  nodes: TypesLegacy.NodeList<TypesLegacy.Node>,
): Types.RouteMap => {
  const map: Types.RouteMap = {};
  if (!nodes) {
    return map;
  }
  Array.from(nodes).forEach(node => {
    if (node.nodeType === TypesLegacy.NODE_TYPE.ELEMENT_NODE) {
      const element = node as TypesLegacy.Element;
      if (isNavigationElement(element)) {
        const id = element.getAttribute('id');
        if (id) {
          map[id] = element;
        }
      }
    }
  });
  return map;
};

/**
 * Merge the nodes from the new document into the current
 * All attributes in the current are reset (selected, merge)
 * If an id is found in both docs, the current node is updated
 * If an id is found only in the new doc, the node is added to the current
 * the 'merge' attribute on a navigator determines if the children are merged or replaced
 */
const mergeNodes = (
  current: TypesLegacy.Element,
  newNodes: TypesLegacy.NodeList<TypesLegacy.Node>,
): void => {
  if (!current || !current.childNodes || !newNodes || newNodes.length === 0) {
    return;
  }

  // Clean out current node attributes for 'merge' and 'selected'
  Array.from(current.childNodes).forEach(node => {
    const element = node as TypesLegacy.Element;
    if (isNavigationElement(element)) {
      if (element.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR) {
        element.setAttribute(Types.KEY_MERGE, 'false');
      } else if (element.localName === TypesLegacy.LOCAL_NAME.NAV_ROUTE) {
        element.setAttribute(Types.KEY_SELECTED, 'false');
      }
    }
  });

  const currentMap: Types.RouteMap = nodesToMap(current.childNodes);

  Array.from(newNodes).forEach(node => {
    if (node.nodeType === TypesLegacy.NODE_TYPE.ELEMENT_NODE) {
      const newElement = node as TypesLegacy.Element;
      if (isNavigationElement(newElement)) {
        const id = newElement.getAttribute('id');
        if (id) {
          const currentElement = currentMap[id] as TypesLegacy.Element;
          if (currentElement) {
            if (newElement.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR) {
              const isMergeable = newElement.getAttribute('merge') === 'true';
              if (isMergeable) {
                currentElement.setAttribute(Types.KEY_MERGE, 'true');
                mergeNodes(currentElement, newElement.childNodes);
              } else {
                current.replaceChild(newElement, currentElement);
              }
            } else if (
              newElement.localName === TypesLegacy.LOCAL_NAME.NAV_ROUTE
            ) {
              // Update the selected route
              currentElement.setAttribute(
                Types.KEY_SELECTED,
                newElement.getAttribute(Types.KEY_SELECTED) || 'false',
              );
              mergeNodes(currentElement, newElement.childNodes);
            }
          } else {
            // Add new element
            current.appendChild(newElement);
          }
        }
      }
    }
  });
};

/**
 * Merge the new document into the current document
 * Creates a clone to force a re-render
 */
export const mergeDocument = (
  newDoc: TypesLegacy.Document,
  currentDoc?: TypesLegacy.Document,
): TypesLegacy.Document => {
  if (!currentDoc) {
    return newDoc;
  }
  if (!newDoc || !newDoc.childNodes) {
    return currentDoc;
  }

  // Create a clone of the current document
  const composite = currentDoc.cloneNode(true);
  const currentRoot = Helpers.getFirstTag(
    composite,
    TypesLegacy.LOCAL_NAME.DOC,
  );

  if (!currentRoot) {
    throw new Errors.HvRouteError('No root element found in current document');
  }

  // Get the <doc>
  const newRoot = Helpers.getFirstTag(newDoc, TypesLegacy.LOCAL_NAME.DOC);
  if (!newRoot) {
    throw new Errors.HvRouteError('No root element found in new document');
  }

  mergeNodes(currentRoot, newRoot.childNodes);
  return composite;
};

export const setSelected = (
  routeDocContext: TypesLegacy.Document | undefined,
  id: string | undefined,
) => {
  if (!routeDocContext || !id) {
    return;
  }
  const route = getRouteById(routeDocContext, id);
  if (route) {
    // Reset all siblings
    if (route.parentNode && route.parentNode.childNodes) {
      Array.from(route.parentNode.childNodes).forEach(
        (sibling: TypesLegacy.Node) => {
          if (sibling.localName === TypesLegacy.LOCAL_NAME.NAV_ROUTE) {
            (sibling as TypesLegacy.Element)?.setAttribute(
              Types.KEY_SELECTED,
              'false',
            );
          }
        },
      );
    }

    // Set the selected route
    route.setAttribute(Types.KEY_SELECTED, 'true');
  }
};
