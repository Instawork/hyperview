/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import HvSelectSingle from 'hyperview/src/components/hv-select-single';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getElements } from 'hyperview/test/helpers';

describe('HvSelectSingle', () => {
  describe('getFormInputValues', () => {
    let elements: Element[];
    beforeEach(() => {
      elements = getElements(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <select-single name="input1">
                  <option value="1" />
                  <option value="2" selected="false" />
                  <option value="3" selected="true" />
                </select-single>
                <select-single name="input2">
                  <option value="1" />
                  <option value="2" />
                  <option value="3" />
                </select-single>
                <select-single name="input3">
                  <option value="1" />
                  <option selected="true" />
                  <option value="3" />
                </select-single>
                <select-single name="input4">
                  <option value="1" />
                  <option value="2" selected="true" />
                  <option value="3" selected="true" />
                </select-single>
                <select-single>
                  <option value="1" />
                  <option value="2" selected="true" />
                  <option value="3" selected="true" />
                </select-single>
              </body>
            </screen>
          </doc>
        `,
        LOCAL_NAME.SELECT_SINGLE,
      );
    });
    it('returns selected option value attr', async () => {
      expect(HvSelectSingle.getFormInputValues(elements[0])).toEqual([
        ['input1', '3'],
      ]);
    });
    it('returns empty array if no selected option', async () => {
      expect(HvSelectSingle.getFormInputValues(elements[1])).toEqual([]);
    });
    it('returns empty string if selection option has no value attr', async () => {
      expect(HvSelectSingle.getFormInputValues(elements[2])).toEqual([
        ['input3', ''],
      ]);
    });
    it('returns first option with selected attr', async () => {
      expect(HvSelectSingle.getFormInputValues(elements[3])).toEqual([
        ['input4', '2'],
      ]);
    });
    it('returns empty array if no name', async () => {
      expect(HvSelectSingle.getFormInputValues(elements[4])).toEqual([]);
    });
  });
});
