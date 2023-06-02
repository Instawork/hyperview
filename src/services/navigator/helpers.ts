/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types-legacy';
import * as UrlService from 'hyperview/src/services/url';
import { ANCHOR_ID_SEPARATOR } from './types';

/**
 * Get an array of all child elements of a node
 */
export const getChildElements = (
  element: TypesLegacy.Element,
): TypesLegacy.Element[] => {
  const elements: TypesLegacy.Element[] = [];
  if (element?.childNodes?.length) {
    for (let i = 0; i < element?.childNodes?.length; i += 1) {
      const child: TypesLegacy.Element = element.childNodes[i];
      if (child.nodeType === TypesLegacy.NODE_TYPE.ELEMENT_NODE) {
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
