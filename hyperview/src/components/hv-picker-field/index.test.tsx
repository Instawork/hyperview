import { HyperviewMock, getElements } from 'hyperview/test/helpers';
import { render, screen, waitFor } from '@testing-library/react-native';
import HvPickerField from 'hyperview/src/components/hv-picker-field';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';

describe('HvPickerField', () => {
  describe('getFormInputValues', () => {
    let elements: Element[];
    beforeEach(() => {
      elements = getElements(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <picker-field name="input1" value="0">
                  <picker-item label="Choice 0" value="0" />
                  <picker-item label="Choice 1" value="1" />
                </picker-field>
                <picker-field name="input2">
                  <picker-item label="Choice 2" value="2" />
                  <picker-item label="Choice 3" value="3" />
                </picker-field>
                <picker-field>
                  <picker-item label="Choice 2" value="2" />
                  <picker-item label="Choice 3" value="3" />
                </picker-field>
              </body>
            </screen>
          </doc>
        `,
        LOCAL_NAME.PICKER_FIELD,
      );
    });
    it('returns value attr', async () => {
      expect(HvPickerField.getFormInputValues(elements[0])).toEqual([
        ['input1', '0'],
      ]);
    });
    it('returns empty string if no value attr', async () => {
      expect(HvPickerField.getFormInputValues(elements[1])).toEqual([
        ['input2', ''],
      ]);
    });
    it('returns empty array if no name attr', async () => {
      expect(HvPickerField.getFormInputValues(elements[2])).toEqual([]);
    });
  });
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);
      await waitFor(() => {
        expect(screen.getByTestId('picker-field')).toBeOnTheScreen();
        return true;
      });
    });
    test('deselectable', async () => {
      render(
        <HyperviewMock paths={[`${__dirname}/stories/deselectable.xml`]} />,
      );
      await waitFor(() => {
        expect(screen.getByTestId('picker-field')).toBeOnTheScreen();
        return true;
      });
    });
    test('filled', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/filled.xml`]} />);
      await waitFor(() => {
        expect(screen.getByTestId('picker-field')).toBeOnTheScreen();
        return true;
      });
    });
  });
});
