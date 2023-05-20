/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as UrlService from 'hyperview/src/services/url';

import {
  ANCHOR_ID_SEPARATOR,
  Document,
  Element,
  LOCAL_NAME,
  LocalName,
  NODE_TYPE,
  NamespaceURI,
} from 'hyperview/src/services/navigator/types';

export const getFirstTag = (
  document: Document,
  localName: LocalName,
  namespace: NamespaceURI = Namespaces.HYPERVIEW,
): Element | null => {
  const elements = document.getElementsByTagNameNS(namespace, localName);
  if (elements && elements[0]) {
    return elements[0];
  }
  return null;
};

// /**
//  * Find the first child node of a node by nodeType
//  */
// export const getNode = (node: Node): Node | undefined => {
//   let child: Node | null | undefined = node.firstChild;
//   while (child?.nodeType !== NODE_TYPE.ELEMENT_NODE) {
//     child = child?.nextSibling;
//   }
//   return child;
// };

/**
 * Get an array of all child elements of a node
 */
export const getChildElements = (element: Element): Element[] => {
  const elements: Element[] = [];
  if (element?.childNodes?.length) {
    for (let i = 0; i < element?.childNodes?.length; i += 1) {
      const child: Element = element.childNodes[i];
      if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
        elements.push(child);
      }
    }
  }
  return elements;
};

/**
 * Get the route designated as 'initial' or the first route if none is marked
 */
export const getInitialNavRouteElement = (
  element: Element,
): Element | undefined => {
  let firstNavChild: Element | undefined;
  let initialChild: Element | undefined;
  const elements: Element[] = getChildElements(element);
  for (let i = 0; i < elements.length; i += 1) {
    const child: Element = elements[i];
    if (
      child.localName === LOCAL_NAME.NAVIGATOR ||
      child.localName === LOCAL_NAME.NAV_ROUTE
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
      break;
    }
  }
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
 * @param href
 * @returns
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
