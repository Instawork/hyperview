import {
  HyperviewMock,
  getDummyHvProps,
  getElements,
} from 'hyperview/test/helpers';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import HvPickerField from 'hyperview/src/elements/hv-picker-field';
import { LOCAL_NAME } from 'hyperview/src/types';
import Picker from 'hyperview/src/components/picker';
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

  describe('picker value', () => {
    const template = `
      <doc xmlns="https://hyperview.org/hyperview">
        <screen>
          <body>
            <picker-field id="picker-field" name="choice" value="1">
              <picker-item label="Choice 0" value="0" />
              <picker-item label="Choice 1" value="1" />
              <picker-item label="Choice 2" value="2" />
            </picker-field>
          </body>
        </screen>
      </doc>
    `;

    /**
     * Renders the field with an `onUpdate` that applies swaps to the document the
     * way Hyperview does, so the component sees the updated element on re-render.
     */
    const renderPickerField = () => {
      let [element] = getElements(template, LOCAL_NAME.PICKER_FIELD);
      const onUpdate = jest.fn((href, action, currentElement, options) => {
        if (action !== 'swap' || !options?.newElement) {
          return;
        }
        const { newElement } = options;
        currentElement.parentNode?.replaceChild(newElement, currentElement);
        element = newElement;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        rerender();
      });
      const rerender = () =>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        result.rerender(
          <HvPickerField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...getDummyHvProps()}
            element={element}
            onUpdate={onUpdate}
          />,
        );
      const result = render(
        <HvPickerField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...getDummyHvProps()}
          element={element}
          onUpdate={onUpdate}
        />,
      );
      return { getElement: () => element, onUpdate };
    };

    const openPicker = () => {
      fireEvent.press(screen.getAllByTestId('picker-field')[0]);
    };

    const scrollTo = (value: string) => {
      fireEvent(screen.UNSAFE_getByType(Picker), 'valueChange', value);
    };

    const getSelectedValue = () =>
      screen.UNSAFE_getByType(Picker).props.selectedValue;

    it('sets picker-value to the field value when opened', () => {
      const { getElement } = renderPickerField();
      openPicker();
      expect(getElement().getAttribute('focused')).toBe('true');
      expect(getElement().getAttribute('picker-value')).toBe('1');
      expect(getSelectedValue()).toBe('1');
    });

    it('keeps the in-flight value out of the document while scrolling', () => {
      const { getElement, onUpdate } = renderPickerField();
      openPicker();
      onUpdate.mockClear();

      scrollTo('2');
      scrollTo('0');

      expect(onUpdate).not.toHaveBeenCalled();
      expect(getElement().getAttribute('picker-value')).toBe('1');
      expect(getElement().getAttribute('value')).toBe('1');
    });

    it('feeds the in-flight value back to the picker while scrolling', () => {
      renderPickerField();
      openPicker();

      scrollTo('2');
      expect(getSelectedValue()).toBe('2');

      scrollTo('0');
      expect(getSelectedValue()).toBe('0');
    });

    it('commits the in-flight value to the field on done', async () => {
      const { getElement } = renderPickerField();
      openPicker();
      scrollTo('2');

      fireEvent.press(screen.getByText('Done'));

      await waitFor(() => {
        expect(getElement().getAttribute('value')).toBe('2');
        return true;
      });
      expect(getElement().getAttribute('focused')).toBe('false');
      expect(getElement().hasAttribute('picker-value')).toBe(false);
    });

    it('discards the in-flight value on cancel', async () => {
      const { getElement } = renderPickerField();
      openPicker();
      scrollTo('2');

      fireEvent.press(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(getElement().getAttribute('focused')).toBe('false');
        return true;
      });
      expect(getElement().getAttribute('value')).toBe('1');
      expect(getElement().hasAttribute('picker-value')).toBe(false);
    });

    it('starts from the field value when reopened after a cancel', async () => {
      const { getElement } = renderPickerField();
      openPicker();
      scrollTo('2');
      fireEvent.press(screen.getByText('Cancel'));
      await waitFor(() => {
        expect(getElement().getAttribute('focused')).toBe('false');
        return true;
      });

      openPicker();
      expect(getSelectedValue()).toBe('1');
    });
  });
});
