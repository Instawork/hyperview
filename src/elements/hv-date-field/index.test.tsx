import { HyperviewMock, getElements } from 'hyperview/test/helpers';
import { createDateFromString, createStringFromDate } from './helpers';
import { render, screen, waitFor } from '@testing-library/react-native';
import HvDateField from 'hyperview/src/components/hv-date-field';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';

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
      expect(createStringFromDate(null)).toEqual('');
    });

    it('returns correct string for double digit month', () => {
      expect(createStringFromDate(new Date(2023, 10, 12))).toEqual(
        '2023-11-12',
      );
    });

    it('returns correct string for single digit month', () => {
      expect(createStringFromDate(new Date(2023, 6, 12))).toEqual('2023-07-12');
    });
  });

  describe('createDateFromString', () => {
    it('returns null if no date', () => {
      expect(createDateFromString(null)).toBeNull();
    });

    it('returns correct date for double digit month', () => {
      expect(createDateFromString('2023-11-12')).toEqual(
        new Date(2023, 10, 12),
      );
    });

    it('returns correct date for single digit month', () => {
      expect(createDateFromString('2023-07-12')).toEqual(new Date(2023, 6, 12));
    });
  });
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        const element = screen.getByTestId('date-field');
        expect(element).toBeOnTheScreen();
        return true;
      });
    });
  });
});
