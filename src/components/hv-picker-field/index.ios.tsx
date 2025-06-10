import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { DOMString, HvComponentProps } from 'hyperview/src/types';
import React, { useCallback, useMemo } from 'react';
import {
  createTestProps,
  getNameValueFormInputValues,
  useStyleProp,
} from 'hyperview/src/services';
import Field from './field';
import { LOCAL_NAME } from 'hyperview/src/types';
import Modal from 'hyperview/src/core/components/modal';
import Picker from 'hyperview/src/core/components/picker';
import { View } from 'react-native';

/**
 * A picker field renders a form field with values that come from a pre-defined list.
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, the system picker is rendered inline on the screen. Pressing the picker
 *   opens a system dialog.
 */
const HvPickerField = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { focused, pressed, pressedSelected, selected } = options;

  /**
   * Returns a string representing the value in the field.
   */
  const value = useMemo((): string => element.getAttribute('value') || '', [
    element,
  ]);

  /**
   * Returns a string representing the value in the picker.
   */
  const pickerValue = useMemo(
    (): string => element.getAttribute('picker-value') || '',
    [element],
  );

  const pickerItems = useMemo(
    (): Element[] =>
      Array.from(
        element.getElementsByTagNameNS(
          Namespaces.HYPERVIEW,
          LOCAL_NAME.PICKER_ITEM,
        ),
      ),
    [element],
  );

  const pickerInitialValue = useMemo((): string => {
    const valueExists = pickerItems.some(
      item => item.getAttribute('value') === value,
    );
    if (valueExists) {
      return value;
    }
    return pickerItems.length > 0
      ? pickerItems[0].getAttribute('value') || ''
      : '';
  }, [pickerItems, value]);

  /**
   * Gets the label from the picker items for the given value.
   * If the value doesn't have a picker item, returns null.
   */
  const getLabelForValue = useCallback(
    (v: DOMString): string | null | undefined => {
      const pickerItemElements: HTMLCollectionOf<Element> = element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      );

      let item: Element | null | undefined = null;
      for (let i = 0; i < pickerItemElements.length; i += 1) {
        const pickerItemElement:
          | Element
          | null
          | undefined = pickerItemElements.item(i);
        if (
          pickerItemElement &&
          pickerItemElement.getAttribute('value') === v
        ) {
          item = pickerItemElement;
          break;
        }
      }
      return item ? item.getAttribute('label') : null;
    },
    [element],
  );

  /**
   * Shows the picker, defaulting to the field's value.
   * If the field is not set, use the first value in the picker.
   */
  const onFieldPress = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'true');
    newElement.setAttribute('picker-value', pickerInitialValue);
    onUpdate(null, 'swap', element, { newElement });
    Behaviors.trigger('focus', newElement, onUpdate);
  }, [element, onUpdate, pickerInitialValue]);

  /**
   * Hides the picker without applying the chosen value.
   */
  const onCancel = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'false');
    newElement.removeAttribute('picker-value');
    onUpdate(null, 'swap', element, { newElement });
    Behaviors.trigger('blur', newElement, onUpdate);
  }, [element, onUpdate]);

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  const onDone = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    newElement.setAttribute('value', pickerValue);
    newElement.removeAttribute('picker-value');
    newElement.setAttribute('focused', 'false');
    onUpdate(null, 'swap', element, { newElement });
    const hasChanged = value !== pickerValue;
    if (hasChanged) {
      Behaviors.trigger('change', newElement, onUpdate);
    }
    Behaviors.trigger('blur', newElement, onUpdate);
  }, [element, onUpdate, pickerValue, value]);

  /**
   * Updates the picker value while keeping the picker open.
   */
  const setPickerValue = useCallback(
    (v: string) => {
      const newElement = element.cloneNode(true) as Element;
      newElement.setAttribute('picker-value', v);
      onUpdate(null, 'swap', element, { newElement });
    },
    [element, onUpdate],
  );

  /**
   * Returns true if the field is focused (and picker is showing).
   */
  const isFocused = useMemo(
    (): boolean => element.getAttribute('focused') === 'true',
    [element],
  );

  const fieldTextStyle = useStyleProp(element, stylesheets, {
    focused,
    pressed,
    pressedSelected,
    selected,
    styleAttr: 'field-text-style',
  });

  const placeholderTextColor: DOMString | null | undefined = useMemo(
    () => element.getAttribute('placeholderTextColor'),
    [element],
  );

  const style = useMemo(() => {
    if (placeholderTextColor && [undefined, null, ''].includes(value)) {
      return { ...fieldTextStyle, color: placeholderTextColor };
    }
    return fieldTextStyle;
  }, [fieldTextStyle, placeholderTextColor, value]);

  const { testID, accessibilityLabel } = useMemo(
    () => createTestProps(element),
    [element],
  );

  // Gets all of the <picker-item> elements. All picker item elements
  // with a value and label are turned into options for the picker.
  const children = useMemo(
    () =>
      pickerItems.filter(Boolean).map((item: Element) => {
        const l: DOMString | null | undefined = item.getAttribute('label');
        const v: DOMString | null | undefined = item.getAttribute('value');
        if (!l || typeof v !== 'string') {
          return null;
        }
        return <Picker.Item key={l + v} label={l} value={v} />;
      }),
    [pickerItems],
  );

  return (
    <Field
      element={element}
      focused={isFocused}
      onPress={onFieldPress}
      options={options}
      stylesheets={stylesheets}
      value={getLabelForValue(value)}
    >
      {isFocused ? (
        <Modal
          element={element}
          focused={isFocused}
          onModalCancel={onCancel}
          onModalDone={onDone}
          onUpdate={onUpdate}
          options={options}
          stylesheets={stylesheets}
        >
          <View accessibilityLabel={accessibilityLabel} testID={testID}>
            <Picker
              onValueChange={setPickerValue}
              selectedValue={pickerValue}
              style={style}
            >
              {children}
            </Picker>
          </View>
        </Modal>
      ) : null}
    </Field>
  );
};

HvPickerField.namespaceURI = Namespaces.HYPERVIEW;
HvPickerField.localName = LOCAL_NAME.PICKER_FIELD;
HvPickerField.getFormInputValues = getNameValueFormInputValues;

export default HvPickerField;
