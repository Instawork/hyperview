// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getElements } from 'hyperview/test/helpers';
import HvDateField from 'hyperview/src/components/hv-date-field';
import { LOCAL_NAME } from 'hyperview/src/types';


describe('HvList', () => {
  describe('getFormInputValues', () => {
    let elements;
    beforeEach(() => {
      elements = getElements(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <date-field name="input" value="2018-10-12" />
                <date-field name="input" />
              </body>
            </screen>
          </doc>
        `,
        LOCAL_NAME.DATE_FIELD,
      );
    });
    it('returns value attr', async () => {
      expect(HvDateField.getFormInputValues(elements[0])).toEqual(['2018-10-12']);
    });
    it('returns empty string if no value attr', async () => {
      expect(HvDateField.getFormInputValues(elements[1])).toEqual(['']);
    });
  });
});
