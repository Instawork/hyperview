// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import HvTextArea from 'hyperview/src/components/hv-text-area';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getElements } from 'hyperview/test/helpers';

describe('HvTextArea', () => {
  describe('getFormInputValues', () => {
    let elements;
    beforeEach(() => {
      elements = getElements(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text-area name="input1" value="hello world" />
                <text-area name="input2" />
                <text-area value="hello world" />
              </body>
            </screen>
          </doc>
        `,
        LOCAL_NAME.TEXT_AREA,
      );
    });
    it('returns value attr', async () => {
      expect(HvTextArea.getFormInputValues(elements[0])).toEqual([
        ['input1', 'hello world'],
      ]);
    });
    it('returns empty string if no value attr', async () => {
      expect(HvTextArea.getFormInputValues(elements[1])).toEqual([
        ['input2', ''],
      ]);
    });

    it('returns empty array if no name attr', async () => {
      expect(HvTextArea.getFormInputValues(elements[2])).toEqual([]);
    });
  });
});
