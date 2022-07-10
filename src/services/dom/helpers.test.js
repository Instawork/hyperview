// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NODE_TYPE } from 'hyperview/src/types';
import { parse } from 'hyperview/test/helpers';
import { preorder } from './helpers';

describe('preorder', () => {
  test('1', () => {
    const node: Document = parse(
      `<text id="a">
          <text id="b">
            <text id="c">   </text>
            <text id="d">   </text>
            <text id="e">
              Hello
            </text>
            <text id="f">
              World
            </text>
          </text>
          <text id="g">
            of HyperView! 
          </text>
          <text id="h"> </text>
        </text>`,
    );
    // $FlowFixMe: preorder expects a Node (which Document is a subtype of)
    expect(preorder(node, NODE_TYPE.TEXT_NODE)).toEqual([
      node.getElementById('a')?.firstChild, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('b')?.firstChild, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('c')?.firstChild, // ◦◦◦
      node.getElementById('c')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('d')?.firstChild, // ◦◦◦
      node.getElementById('d')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('e')?.firstChild, // Hello
      node.getElementById('e')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('f')?.firstChild, // World
      node.getElementById('f')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('g')?.previousSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('g')?.firstChild, // of Hyperview!
      node.getElementById('g')?.nextSibling, // ⏎◦◦◦◦◦◦◦◦◦◦◦◦
      node.getElementById('h')?.firstChild, // ◦
      node.getElementById('a')?.lastChild, // ⏎◦◦◦◦◦◦◦◦◦◦
    ]);
  });
});
