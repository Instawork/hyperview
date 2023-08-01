/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// THIS FILE CONTAINS TS VERSIONS OF METHODS FROM /src/services/dom/helpers.js
// THE COMPLETE TS MIGRATION OF THIS FILE WILL REPLACE THIS
// CHANGES MADE TO ANY IMPLEMENTATIONS ARE NOTEDED BELOW AND MARKED WITH ***** ADDED *****

import * as Namespaces from 'hyperview/src/services/namespaces';
import {
  Document,
  Element,
  LocalName,
  NODE_TYPE,
  NamespaceURI,
  Node,
} from 'hyperview/src/types-legacy';

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

/**
 * Find the first child element of a node with a given local name and namespace
 */
export const getFirstChildTag = <T extends Node>(
  node: Node,
  localName: LocalName,
  namespace: NamespaceURI = Namespaces.HYPERVIEW,
): T | null => {
  if (!node || !node.childNodes) {
    return null;
  }
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const child = node.childNodes[i];
    if (
      child.nodeType === NODE_TYPE.ELEMENT_NODE &&
      child.localName === localName &&
      child.namespaceURI === namespace
    ) {
      return child as T;
    }
  }
  return null;
};
