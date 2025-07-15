import { HyperviewMock, getElements } from 'hyperview/test/helpers';
import { render, screen, waitFor } from '@testing-library/react-native';
import HvSwitch from 'hyperview/src/elements/hv-switch';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';

describe('HvSwitch', () => {
  describe('getFormInputValues', () => {
    let elements: Element[];
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
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        const element = screen.getByRole('switch');
        expect(element).toBeOnTheScreen();
        expect(element.props.onTintColor).toBe('#4778FF');
        expect(element.props.tintColor).toBe('#E1E1E1');
        expect(element.props.value).toBe(true);
        expect(element.props.thumbTintColor).toBe(undefined);
        return true;
      });
    });
  });
});
