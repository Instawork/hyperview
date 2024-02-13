import * as Errors from './errors';
import * as Helpers from 'hyperview/src/services/dom/helpers';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Types from './types';
import * as UrlService from 'hyperview/src/services/url';
import { ANCHOR_ID_SEPARATOR, Route } from './types';
import { LOCAL_NAME, NAV_ACTIONS, NODE_TYPE } from 'hyperview/src/types';
import type { NavAction, NavigationRouteParams } from 'hyperview/src/types';
import { shallowCloneToRoot } from 'hyperview/src/services';

/**
 * Card and modal routes are not defined in the document
 */
export const isDynamicRoute = (id: string): boolean => {
  return id === Types.ID_CARD || id === Types.ID_MODAL;
};

export const isModalRouteName = (name: string): boolean => {
  return name === Types.ID_MODAL;
};

/**
 * Get an array of all child elements of a node
 */
export const getChildElements = (element: Element | Document): Element[] => {
  return (Array.from(element.childNodes as NodeListOf<Element>) || []).filter(
    (child: Element) => {
      return child.nodeType === NODE_TYPE.ELEMENT_NODE;
    },
  );
};

/**
 * Determine if an element is a navigation element
 */
export const isNavigationElement = (element: Element): boolean => {
  return (
    element.namespaceURI === Namespaces.HYPERVIEW &&
    (element.localName === LOCAL_NAME.NAVIGATOR ||
      element.localName === LOCAL_NAME.NAV_ROUTE)
  );
};

/**
 * Get the route designated as 'selected'
 */
export const getSelectedNavRouteElement = (
  element: Element,
): Element | undefined => {
  const elements: Element[] = getChildElements(element).filter(child =>
    isNavigationElement(child),
  );

  if (!elements.length) {
    return undefined;
  }

  const selectedChild = elements.find(
    child => child.getAttribute(Types.KEY_SELECTED) === 'true',
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
  action: NavAction,
  routeParams: NavigationRouteParams,
) => {
  if (action === NAV_ACTIONS.PUSH || action === NAV_ACTIONS.NEW) {
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
  routeParams: NavigationRouteParams,
  index = 0,
): Types.NavigationNavigateParams | NavigationRouteParams => {
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
  action: NavAction,
  url: string | undefined,
): string => {
  if (url && isUrlFragment(url)) {
    return cleanHrefFragment(url);
  }

  return action === NAV_ACTIONS.NEW ? Types.ID_MODAL : Types.ID_CARD;
};

/**
 * Search for a route with the given id
 */
export const getRouteById = (
  doc: Document,
  id: string,
): Element | undefined => {
  const routes = Array.from(
    doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.NAV_ROUTE),
  ).filter((n: Element) => {
    return n.getAttribute(Types.KEY_ID) === id;
  });
  return routes && routes.length > 0 ? routes[0] : undefined;
};

/**
 * Search for a route with the given url
 */
export const getRouteByUrl = (
  doc: Document,
  url: string,
  baseUrl: string,
): Element | undefined => {
  const routes = Array.from(
    doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.NAV_ROUTE),
  ).filter((n: Element) => {
    return (
      getUrlFromHref(n.getAttribute(Types.KEY_HREF), baseUrl) ===
      getUrlFromHref(url, baseUrl)
    );
  });
  return routes[0];
};

/**
 * Search for a navigator with the given id
 */
export const getNavigatorById = (
  doc: Document,
  id: string,
): Element | undefined => {
  const navigators = Array.from(
    doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.NAVIGATOR),
  ).filter((n: Element) => {
    return n.getAttribute(Types.KEY_ID) === id;
  });
  return navigators[0];
};

/**
 * Determine the action to perform based on the route params
 * Correct for a push action being introduced in
 * `this.getRouteKey(url);` in `hyperview/src/services/navigation`
 * Url fragments are treated as a navigate action
 */
export const getNavAction = (
  action: NavAction,
  routeParams?: NavigationRouteParams,
): NavAction => {
  if (
    routeParams &&
    routeParams.url &&
    action === NAV_ACTIONS.PUSH &&
    isUrlFragment(routeParams.url)
  ) {
    return NAV_ACTIONS.NAVIGATE;
  }
  return action;
};

const isRouteModal = (state: Types.NavigationState, index: number): boolean => {
  if (!state || index > state.routes.length - 1) {
    return false;
  }
  return isModalRouteName(state.routes[index].name);
};

/**
 * Handle close logic
 * Search up the hierarchy for the first stack which is presenting a modal screen
 */
const buildCloseRequest = (
  navigation: Types.NavigationProp | undefined,
  routeParams?: NavigationRouteParams,
): [
  NavAction,
  Types.NavigationProp | undefined,
  string,
  Types.NavigationNavigateParams | NavigationRouteParams | undefined,
] => {
  if (!navigation) {
    return [NAV_ACTIONS.CLOSE, navigation, '', routeParams];
  }

  const state = navigation.getState();
  if (state.type === Types.NAVIGATOR_TYPE.STACK) {
    // Check if current route is modal
    if (isRouteModal(state, state.index)) {
      return [NAV_ACTIONS.CLOSE, navigation, '', routeParams];
    }
    // Check if current stack contains a modal earlier in the stack
    for (let i = state.index; i > 0; i -= 1) {
      if (isRouteModal(state, i)) {
        // Target the route before the modal for navigation
        const targetRoute = state.routes[i - 1];
        return [
          NAV_ACTIONS.NAVIGATE,
          navigation,
          targetRoute.name,
          { ...targetRoute.params, ...routeParams },
        ];
      }
    }
  }
  const parent = navigation.getParent();
  if (!parent) {
    return [NAV_ACTIONS.CLOSE, navigation, '', routeParams];
  }
  return buildCloseRequest(parent, routeParams);
};

/**
 * Build the request structure including finding the navigation,
 * building params, and determining screen id
 */
export const buildRequest = (
  nav: Types.NavigationProp | undefined,
  action: NavAction,
  routeParams?: NavigationRouteParams,
): [
  NavAction,
  Types.NavigationProp | undefined,
  string,
  Types.NavigationNavigateParams | NavigationRouteParams | undefined,
] => {
  const navAction: NavAction = getNavAction(action, routeParams);

  if (!routeParams) {
    if (navAction === NAV_ACTIONS.CLOSE) {
      return buildCloseRequest(nav, {});
    }
    return [navAction, nav, '', {}];
  }

  // For a back behavior with params, the current navigator is targeted
  if (navAction === NAV_ACTIONS.BACK && routeParams.url) {
    return [navAction, nav, '', routeParams];
  }

  validateUrl(navAction, routeParams);

  const [navigation, path] = getNavigatorAndPath(
    routeParams.targetId || '',
    nav,
  );

  const cleanedParams: NavigationRouteParams = { ...routeParams };
  if (cleanedParams.url && isUrlFragment(cleanedParams.url)) {
    // When a fragment is used, the original url is used for the route
    // setting url to undefined will overwrite the value, so the url has to be
    // deleted to allow merging the params while retaining the original url
    delete cleanedParams.url;
  }

  if (!navigation) {
    return [navAction, undefined, '', cleanedParams];
  }

  const routeId = getRouteId(navAction, routeParams.url ?? undefined);

  if (!path || !path.length) {
    return [navAction, navigation, routeId, cleanedParams];
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
    | NavigationRouteParams = buildParams(routeId, path, cleanedParams);

  return [navAction, navigation, lastPathId || routeId, params];
};

/**
 * Create a map of <id, element> from a list of nodes
 */
const nodesToMap = (nodes: NodeListOf<Node>): Types.RouteMap => {
  const map: Types.RouteMap = {};
  if (!nodes) {
    return map;
  }
  Array.from(nodes).forEach(node => {
    if (node.nodeType === NODE_TYPE.ELEMENT_NODE) {
      const element = node as Element;
      if (isNavigationElement(element)) {
        const id = element.getAttribute(Types.KEY_ID);
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
const mergeNodes = (current: Element, newNodes: NodeListOf<Node>): void => {
  if (!current || !current.childNodes || !newNodes || newNodes.length === 0) {
    return;
  }

  // Clean out current node attributes for 'merge' and 'selected'
  Array.from(current.childNodes).forEach(node => {
    const element = node as Element;
    if (isNavigationElement(element)) {
      if (element.localName === LOCAL_NAME.NAVIGATOR) {
        element.setAttribute(Types.KEY_MERGE, 'false');
      } else if (element.localName === LOCAL_NAME.NAV_ROUTE) {
        element.setAttribute(Types.KEY_SELECTED, 'false');
      }
    }
  });

  const currentMap: Types.RouteMap = nodesToMap(current.childNodes);

  Array.from(newNodes).forEach(node => {
    if (node.nodeType === NODE_TYPE.ELEMENT_NODE) {
      const newElement = node as Element;
      if (isNavigationElement(newElement)) {
        const id = newElement.getAttribute(Types.KEY_ID);
        if (id) {
          const currentElement = currentMap[id] as Element;
          if (currentElement) {
            if (newElement.localName === LOCAL_NAME.NAVIGATOR) {
              // Merge if the attribute is set and the navigator types are the same
              const isMergeable =
                newElement.getAttribute(Types.KEY_MERGE) === 'true' &&
                newElement.getAttribute(Types.KEY_TYPE) ===
                  currentElement.getAttribute(Types.KEY_TYPE);
              if (isMergeable) {
                currentElement.setAttribute(Types.KEY_MERGE, 'true');
                mergeNodes(currentElement, newElement.childNodes);
              } else {
                current.replaceChild(newElement, currentElement);
              }
            } else if (newElement.localName === LOCAL_NAME.NAV_ROUTE) {
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
  newDoc: Document,
  currentDoc?: Document,
): Document => {
  if (!currentDoc) {
    return newDoc;
  }
  if (!newDoc || !newDoc.childNodes) {
    return currentDoc;
  }

  // Get the <doc>
  const newRoot = Helpers.getFirstTag(newDoc, LOCAL_NAME.DOC);
  if (!newRoot) {
    throw new Errors.HvRouteError('No root element found in new document');
  }
  const currentRoot = Helpers.getFirstTag(currentDoc, LOCAL_NAME.DOC);
  if (!currentRoot) {
    throw new Errors.HvRouteError('No root element found in current document');
  }

  // Look for a primary difference in the first element
  // Example: <navigator> to <screen>
  const [newElement] = getChildElements(newRoot);
  const [currentElement] = getChildElements(currentRoot);
  if (currentElement?.localName !== newElement?.localName) {
    // Replace the current document if the first elements are different
    return newDoc;
  }

  // Create a clone of the current document
  const composite = currentDoc.cloneNode(true) as Document;
  const compositeRoot = Helpers.getFirstTag(composite, LOCAL_NAME.DOC);

  if (!compositeRoot) {
    throw new Errors.HvRouteError('No root element found in current document');
  }

  mergeNodes(compositeRoot, newRoot.childNodes);
  return composite;
};

export const setSelected = (
  doc: Document | undefined,
  id: string | undefined,
  setDoc?: ((d: Document) => void) | undefined,
) => {
  if (!doc || !id) {
    return;
  }
  const route = getRouteById(doc, id);
  if (route && route.parentNode) {
    const parentNode = route.parentNode as Element;
    const type = parentNode.getAttribute(Types.KEY_TYPE);
    if (type !== Types.NAVIGATOR_TYPE.TAB) {
      return;
    }

    // Reset all siblings
    if (parentNode.childNodes) {
      Array.from(parentNode.childNodes).forEach((child: Node) => {
        const sibling = child as Element;
        if (sibling && sibling.localName === LOCAL_NAME.NAV_ROUTE) {
          sibling.setAttribute(Types.KEY_SELECTED, 'false');
        }
      });
    }

    // Set the selected route
    route.setAttribute(Types.KEY_SELECTED, 'true');
  }

  if (setDoc) {
    const newRoot = shallowCloneToRoot(doc);
    setDoc(newRoot);
  }
};

/**
 * Remove a stack route from the document
 */
export const removeStackRoute = (
  doc: Document | undefined,
  url: string | undefined,
  baseUrl: string,
  setDoc?: ((d: Document) => void) | undefined,
) => {
  if (!doc || !url) {
    return;
  }
  const route = getRouteByUrl(doc, url, baseUrl);
  if (route && route.parentNode) {
    const parentNode = route.parentNode as Element;
    const type = parentNode.getAttribute(Types.KEY_TYPE);
    if (type === Types.NAVIGATOR_TYPE.STACK) {
      if (getChildElements(parentNode).length > 1) {
        parentNode.removeChild(route);

        if (setDoc) {
          const newRoot = shallowCloneToRoot(doc);
          setDoc(newRoot);
        }
      }
    }
  }
};

/**
 * Add a route to a stack navigator
 */
export const addStackRoute = (
  doc: Document | undefined,
  id: string | undefined,
  route: Route<string, NavigationRouteParams> | undefined,
  siblingName: string | undefined,
  baseUrl: string,
  setDoc?: ((d: Document) => void) | undefined,
) => {
  if (
    !doc ||
    !id ||
    !route ||
    !siblingName ||
    !isDynamicRoute(route.name) ||
    !route.params.url ||
    getRouteByUrl(doc, route.params.url, baseUrl)
  ) {
    return;
  }

  const siblingElement = getRouteById(doc, siblingName);
  if (siblingElement && siblingElement.parentNode) {
    const parentElement = siblingElement.parentNode as Element;
    const type = parentElement.getAttribute(Types.KEY_TYPE);
    if (type === Types.NAVIGATOR_TYPE.STACK) {
      const element = doc.createElementNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.NAV_ROUTE,
      );
      element.setAttribute(Types.KEY_ID, id);
      element.setAttribute(Types.KEY_HREF, route.params.url);
      parentElement.appendChild(element);

      if (setDoc) {
        const newRoot = shallowCloneToRoot(doc);
        setDoc(newRoot);
      }
    }
  }
};
