/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Element,
  Node,
  NODE_TYPE,
} from 'hyperview/src/services/navigator/types';

/**
 * Find the first child node of a node by nodeType
 */
export const getNode = (node: Node): Node | undefined => {
  let child: Node | undefined = node.firstChild;
  // while (child?.nodeType !== NODE_TYPE.ELEMENT_NODE) {
  while (child?.nodeType !== NODE_TYPE.ELEMENT_NODE) {
    child = child?.nextSibling;
  }
  return child;
};
