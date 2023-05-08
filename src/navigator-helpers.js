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
  Node,
} from 'hyperview/src/types';
// eslint-disable-next-line instawork/import-services
import { ANCHOR_ID_SEPARATOR } from 'hyperview/src/services/navigation';
import { getFirstTag } from 'hyperview/src/services/dom/helpers';

export const getFirstchild = (node: Node): Node => {
  let child: Node = node.firstChild;
  while (child.nodeType !== 1) {
    child = child.nextSibling;
  }
  return child;
};

export const getRootNode = (
  doc: Document,
  localName: LocalName = LOCAL_NAME.DOC,
): Node => {
  const docElement: Element = getFirstTag(doc, localName);
  if (!docElement) {
    throw new Errors.XMLRequiredElementNotFound(localName);
  }
  return getFirstchild(docElement);
};

export const getChildElements = (doc: Document): Element[] => {
  const elements: Element[] = [];
  for (let i: Number = 0; i < doc.childNodes.length; i += 1) {
    const node: Node = doc.childNodes[i];
    if (node.nodeType === 1) {
      elements.push(node);
    }
  }
  return elements;
};

export const getInitialNavRouteNode = (doc: Document): Node => {
  let firstNavChild: Node = null;
  let initialChild: Node = null;
  const elements: Element[] = getChildElements(doc);
  for (let i: Number = 0; i < elements.length; i += 1) {
    const node: Node = elements[i];
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

export const getProp = (
  props: Object,
  name: String,
  context: Object = null,
): String => {
  if (props[name]) {
    return props[name];
  }
  if (props.route && props.route.params && props.route.params[name]) {
    return props.route.params[name];
  }
  if (context && context[name]) {
    return context[name];
  }
  return null;
};

export const isUrlFragment = (url: string): boolean => {
  return url?.startsWith(ANCHOR_ID_SEPARATOR);
};

export const cleanHrefFragment = (url: string): string => {
  if (!isUrlFragment(url)) {
    return url;
  }
  return url.slice(1);
};
