/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as InlineContext from 'hyperview/src/services/inline-context';
import { parse } from 'hyperview/test/helpers';

describe('inlineFormatter', () => {
  test('1', () => {
    const node = parse(
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
    const expectedNodes = [
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
    ];
    const expectedValues = [
      '',
      '',
      '',
      '',
      '',
      '',
      'Hello ',
      '',
      'World ',
      '',
      '',
      'of HyperView!',
      '',
      '',
      '',
    ];
    expect(InlineContext.formatter(node)).toEqual([
      expectedNodes,
      expectedValues,
    ]);
  });
});
