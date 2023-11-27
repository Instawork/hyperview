/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import HvDateField from 'hyperview/src/components/hv-date-field';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getElements } from 'hyperview/test/helpers';

describe('HvDateField', () => {
  describe('getFormInputValues', () => {
    let elements: Element[];
    beforeEach(() => {
      elements = getElements(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <date-field name="input1" value="2018-10-12" />
                <date-field name="input2" />
                <date-field value="2018-10-12" />
              </body>
            </screen>
          </doc>
        `,
        LOCAL_NAME.DATE_FIELD,
      );
    });
    it('returns value attr', async () => {
      expect(HvDateField.getFormInputValues(elements[0])).toEqual([
        ['input1', '2018-10-12'],
      ]);
    });
    it('returns empty string if no value attr', async () => {
      expect(HvDateField.getFormInputValues(elements[1])).toEqual([
        ['input2', ''],
      ]);
    });
    it('returns empty array if no name attr', async () => {
      expect(HvDateField.getFormInputValues(elements[2])).toEqual([]);
    });
  });

  describe('createStringFromDate', () => {
    it('returns empty string if no date', () => {
      expect(HvDateField.createStringFromDate(null)).toEqual('');
    });

    it('returns correct string for double digit month', () => {
      expect(HvDateField.createStringFromDate(new Date(2023, 10, 12))).toEqual(
        '2023-11-12',
      );
    });

    it('returns correct string for single digit month', () => {
      expect(HvDateField.createStringFromDate(new Date(2023, 6, 12))).toEqual(
        '2023-07-12',
      );
    });
  });
});
