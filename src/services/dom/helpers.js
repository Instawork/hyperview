// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  Document,
  LocalName,
  NamespaceURI,
  Node,
  NodeType,
} from 'hyperview/src/types';

export const getBehaviorElements = (element: any) => {
  // $FlowFixMe
  const behaviorElements = Array.from(element.childNodes).filter(
    n => n.tagName === 'behavior',
  );

  if (element.getAttribute('href') || element.getAttribute('action')) {
    behaviorElements.unshift(element);
  }

  return behaviorElements;
};

export const getFirstTag = (
  document: Document,
  localName: LocalName,
  namespace: NamespaceURI = Namespaces.HYPERVIEW,
) => {
  const elements = document.getElementsByTagNameNS(namespace, localName);
  if (elements && elements[0]) {
    return elements[0];
  }
  return null;
};

export const getPreviousNodeOfType = (node: ?Node, type: NodeType): ?Node => {
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
    Array.from(root.childNodes).forEach((node: ?Node) => {
      if (node) {
        preorder(node, type, acc);
      }
    });
  } else if (root.nodeType === type) {
    acc.push(root);
  }
  return acc;
};
