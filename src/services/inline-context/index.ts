/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  EMPTY,
  convertLineBreaksIntoSpaces,
  ignoreSpacesAfterLineBreak,
  ignoreSpacesFollowingSpace,
  trim,
} from './helpers';
import type { Element, Node } from 'hyperview/src/types';
import { NODE_TYPE } from 'hyperview/src/types';
import { preorder } from 'hyperview/src/services/dom/helpers';

/**
 * Given the following markup:

   <text id="a">⏎
   ◦◦<text id="b">⏎
   ◦◦◦◦<text id="d">⏎
   ◦◦◦◦◦◦Hello⏎
   ◦◦◦◦</text>⏎
   ◦◦◦◦<text id="e">⏎
   ◦◦◦◦◦◦World⏎
   ◦◦◦◦</text>⏎
   ◦◦</text>⏎
   ◦◦<text id="c">⏎
   ◦◦◦◦of HyperView!⏎
   ◦◦</text>⏎
   </text>

   And its associated tree representation:

                                          [<text id="a">]
      __________________________________________|_________________________________
     /                        /                       \            \              \
    /                        /                         \            \              \
   /                        /                           \            \              \
[⏎◦◦]              [<text id="b"/>]                      [⏎◦◦]    [<text id="c"/>]    [⏎]
         _________________|__________________________                     |
       /       |              |           |          \                    |
      /        |              |           |           \                   |
     /         |              |           |            \            [⏎◦◦◦◦of HyperView!⏎]
[⏎◦◦◦◦]  [<text id="d"/>]  [⏎◦◦◦◦]  [<text id="e"/>]  [⏎◦◦]
               |                            |
               |                            |
               |                            |
         [⏎◦◦◦◦◦◦Hello⏎]              [⏎◦◦◦◦◦◦World⏎◦◦◦◦]

  We're using using preorder traversal algorithm to retrieve leaf nodes, and put them in a list, such as:

  ['⏎◦◦', '⏎◦◦◦◦', '⏎◦◦◦◦◦◦Hello⏎', '⏎◦◦◦◦', '⏎◦◦◦◦◦◦World⏎◦◦◦◦', '⏎◦◦', '⏎◦◦', '⏎◦◦◦◦of HyperView!⏎', '⏎']

  For each node, we then apply the following rules:

  1- All spaces immediately before and after a line break are ignored:
    ['⏎', '⏎', '⏎Hello⏎', '⏎', '⏎World⏎', '⏎', '⏎', '⏎of HyperView!⏎', '⏎']

  2- Line breaks are converted to spaces:
    ['◦', '◦', '◦Hello◦', '◦', '◦World◦', '◦', '◦', '◦of HyperView!◦', '◦']

  3- Any space immediately following another space is ignored
    ['◦', '', 'Hello◦', '', 'World◦', '', '', 'of HyperView!◦', '']

  4- Sequences of spaces at the beginning and end of a line are removed
    ['', '', 'Hello◦', '', 'World◦', '', '', 'of HyperView!', '']

  (inspired by: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace#how_does_css_process_whitespace#explanation)
 */
export const formatter = (root: Element): [Node[], string[]] => {
  const nodes = preorder(root, NODE_TYPE.TEXT_NODE);

  const nodeValues: string[] = Array.from<Node>(nodes)
    .map((node: Node): string => {
      return node && node.nodeValue
        ? ignoreSpacesAfterLineBreak(node.nodeValue)
        : EMPTY;
    })
    .map((nodeValue: string) => convertLineBreaksIntoSpaces(nodeValue));

  return [nodes, trim(ignoreSpacesFollowingSpace(nodeValues))];
};
