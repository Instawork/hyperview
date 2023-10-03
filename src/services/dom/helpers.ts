/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type { LocalName, NamespaceURI, NodeType } from 'hyperview/src/types';

export const getBehaviorElements = (element: any) => {
  const behaviorElements = Array.from<Element>(element.childNodes).filter(
    n => n.tagName === 'behavior',
  );

  if (element.getAttribute('href') || element.getAttribute('action')) {
    behaviorElements.unshift(element);
  }

  return behaviorElements;
};

export const getFirstTag = (
  document: Document | Element,
  localName: LocalName,
  namespace: NamespaceURI = Namespaces.HYPERVIEW,
) => {
  const elements = document.getElementsByTagNameNS(namespace, localName);
  if (elements && elements[0]) {
    return elements[0];
  }
  return null;
};

export const getPreviousNodeOfType = (
  node: Node | null,
  type: NodeType,
): Node | null => {
  if (!node || !node.previousSibling) {
    return null;
  }
  if (node.previousSibling?.nodeType === type) {
    return node.previousSibling;
  }
  return getPreviousNodeOfType(node.previousSibling, type);
};

/**
 * N-ary Tree Preorder Traversal
 */
export const preorder = (
  root: Node,
  type: NodeType,
  acc: Node[] = [],
): Node[] => {
  if (root.childNodes) {
    Array.from<Node>(root.childNodes).forEach((node?: Node | null) => {
      if (node) {
        preorder(node, type, acc);
      }
    });
  } else if (root.nodeType === type) {
    acc.push(root);
  }
  return acc;
};

export const safeParseIntAttribute = (
  element: Element,
  attribute: string,
): number | undefined => {
  const attrValue = element.getAttribute(attribute);
  if (attrValue === null || typeof attrValue === 'undefined') {
    return undefined;
  }
  return parseInt(attrValue, 10);
};

export const safeParseIntAttributeNS = (
  element: Element | null | undefined,
  namespaceURI: NamespaceURI,
  localName: LocalName,
): number | undefined => {
  if (!element) {
    return undefined;
  }
  const attrValue = element.getAttributeNS(namespaceURI, localName);
  if (attrValue === null || typeof attrValue === 'undefined') {
    return undefined;
  }
  return parseInt(attrValue, 10);
};

export const safeParseFloatAttribute = (
  element: Element,
  attribute: string,
): number | undefined => {
  const attrValue = element.getAttribute(attribute);
  if (attrValue === null || typeof attrValue === 'undefined') {
    return undefined;
  }
  return parseFloat(attrValue);
};

export const safeParseFloatAttributeNS = (
  element: Element | null | undefined,
  namespaceURI: NamespaceURI,
  localName: LocalName,
): number | undefined => {
  if (!element) {
    return undefined;
  }
  const attrValue = element.getAttributeNS(namespaceURI, localName);
  if (attrValue === null || typeof attrValue === 'undefined') {
    return undefined;
  }
  return parseFloat(attrValue);
};
