/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Types from 'hyperview/src/types-legacy';
import * as UrlService from 'hyperview/src/services/url';
import { ANCHOR_ID_SEPARATOR } from './types';

/**
 * Get an array of all child elements of a node
 */
export const getChildElements = (element: Types.Element): Types.Element[] => {
  const elements: Types.Element[] = [];
  if (element?.childNodes?.length) {
    for (let i = 0; i < element?.childNodes?.length; i += 1) {
      const child: Types.Element = element.childNodes[i];
      if (child.nodeType === Types.NODE_TYPE.ELEMENT_NODE) {
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
  element: Types.Element,
): Types.Element | undefined => {
  let firstNavChild: Types.Element | undefined;
  let initialChild: Types.Element | undefined;
  const elements: Types.Element[] = getChildElements(element);
  for (let i = 0; i < elements.length; i += 1) {
    const child: Types.Element = elements[i];
    if (
      child.localName === Types.LOCAL_NAME.NAVIGATOR ||
      child.localName === Types.LOCAL_NAME.NAV_ROUTE
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
