// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getElements } from 'hyperview/test/helpers';
import HvSwitch from 'hyperview/src/components/hv-switch';
import { LOCAL_NAME } from 'hyperview/src/types';

describe('HvSwitch', () => {
  describe('getFormInputValues', () => {
    let elements;
    beforeEach(() => {
      elements = getElements(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <switch name="input1" value="on" />
                <switch name="input2" />
                <switch value="on" />
              </body>
            </screen>
          </doc>
        `,
        LOCAL_NAME.SWITCH,
      );
    });
    it('returns value attr of on', async () => {
      expect(HvSwitch.getFormInputValues(elements[0])).toEqual([
        ['input1', 'on'],
      ]);
    });
    it('returns empty string if no value attr', async () => {
      expect(HvSwitch.getFormInputValues(elements[1])).toEqual([
        ['input2', ''],
      ]);
    });

    it('returns empty array if no name attr', async () => {
      expect(HvSwitch.getFormInputValues(elements[2])).toEqual([]);
    });
  });
});
