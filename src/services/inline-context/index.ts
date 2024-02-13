import * as Dom from 'hyperview/src/services/dom';
import {
  EMPTY,
  convertLineBreaksIntoSpaces,
  ignoreSpacesAfterLineBreak,
  ignoreSpacesFollowingSpace,
  trim,
} from './helpers';
import { NODE_TYPE } from 'hyperview/src/types';

/* eslint-disable max-len */
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
/* eslint-enable max-len */
export const formatter = (root: Element | Document): [Node[], string[]] => {
  const nodes = Dom.preorder(root, NODE_TYPE.TEXT_NODE);

  const nodeValues: string[] = Array.from(nodes)
    // eslint-disable-next-line no-confusing-arrow
    .map((node: Node): string =>
      node && node.nodeValue
        ? ignoreSpacesAfterLineBreak(node.nodeValue)
        : EMPTY,
    )
    .map((nodeValue: string) => convertLineBreaksIntoSpaces(nodeValue));

  return [nodes, trim(ignoreSpacesFollowingSpace(nodeValues))];
};
