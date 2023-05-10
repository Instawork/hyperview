// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from 'hyperview/src/services/dom/errors';
import {
  Document,
  Element,
  LOCAL_NAME,
  LocalName,
  NAV_ACTIONS,
} from 'hyperview/src/types';
// eslint-disable-next-line instawork/import-services
import { ANCHOR_ID_SEPARATOR } from 'hyperview/src/services/navigation';
import { Navigation } from '@react-navigation/native';
import { getFirstTag } from 'hyperview/src/services/dom/helpers';

export const SCREEN_DYNAMIC = 'dynamic';
export const SCREEN_MODAL = 'modal';

/**
 * Find the first child element of a node by nodeType
 */
export const getFirstchild = (node: Element): Element => {
  let child: Element = node.firstChild;
  while (child.nodeType !== 1) {
    child = child.nextSibling;
  }
  return child;
};

/**
 * Find the root node of a document by localName
 */
export const getRootNode = (
  doc: Document,
  localName: LocalName = LOCAL_NAME.DOC,
): Element => {
  const docElement: Element = getFirstTag(doc, localName);
  if (!docElement) {
    throw new Errors.XMLRequiredElementNotFound(localName);
  }
  return getFirstchild(docElement);
};

/**
 * Get an array of all child elements of a node
 */
export const getChildElements = (doc: Document): Element[] => {
  const elements: Element[] = [];
  for (let i: Number = 0; i < doc.childNodes.length; i += 1) {
    const node: Element = doc.childNodes[i];
    if (node.nodeType === 1) {
      elements.push(node);
    }
  }
  return elements;
};

/**
 * Get the route designated as 'initial' or the first route if none is marked
 */
export const getInitialNavRouteNode = (doc: Document): Element => {
  let firstNavChild: Element = null;
  let initialChild: Element = null;
  const elements: Element[] = getChildElements(doc);
  for (let i: Number = 0; i < elements.length; i += 1) {
    const node: Element = elements[i];
    if (
      node.nodeName === LOCAL_NAME.NAVIGATOR ||
      node.nodeName === LOCAL_NAME.NAV_ROUTE
    ) {
      if (
        !initialChild &&
        node.getAttribute('initial')?.toLowerCase() === 'true'
      ) {
        initialChild = node;
      }
      if (!initialChild && !firstNavChild) {
        firstNavChild = node;
      }
    }

    if (initialChild) {
      break;
    }
  }
  return initialChild || firstNavChild;
};

/**
 * Get a property from props or route.params
 */
export const getProp = (props: Object, name: String): String => {
  if (props[name]) {
    return props[name];
  }
  if (props.route && props.route.params && props.route.params[name]) {
    return props.route.params[name];
  }
  return null;
};

/**
 * Determine if a url is a fragment
 */
export const isUrlFragment = (url: string): boolean => {
  return url?.startsWith(ANCHOR_ID_SEPARATOR);
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
 * Check if a navigation component contains a route by name
 */
export const navigationContainsRoute = (
  navigation: Navigation,
  routeId: string,
): boolean => {
  if (!navigation) {
    return false;
  }
  const { routes } = navigation.getState();
  for (let i = 0; i < routes.length; i += 1) {
    const route: Object = routes[i];
    if (route.name === routeId) {
      return true;
    }
  }
  return false;
};

/**
 * Create a virtual for urls which are not associated with a route
 */
export const getVirtualScreenId = (
  navigation: Navigation,
  action: NavAction,
  routeId: string,
): string => {
  if (routeId && !isUrlFragment(routeId)) {
    let id: string = null;
    switch (action) {
      case NAV_ACTIONS.NAVIGATE:
      case NAV_ACTIONS.PUSH:
        id = SCREEN_DYNAMIC;
        break;
      case NAV_ACTIONS.NEW:
        id = SCREEN_MODAL;
        break;
      default:
    }
    if (navigationContainsRoute(navigation, id)) {
      return id;
    }
  }
  return routeId;
};
