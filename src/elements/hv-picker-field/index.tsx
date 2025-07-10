import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  HvComponentProps,
  StyleSheet,
} from 'hyperview/src/types';
import React, { useCallback } from 'react';
import {
  createStyleProp,
  createTestProps,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
import Picker from 'hyperview/src/components/picker';
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

  /**
   * Returns a string representing the value in the field.
   */
  const getValue = useCallback(
    (): string => element.getAttribute('value') || '',
    [element],
  );

  /**
   * Returns a string representing the value in the picker.
   */
  const getPickerValue = useCallback(
    (): string => element.getAttribute('value') || '',
    [element],
  );

  const getPickerItems = useCallback(
    (): Element[] =>
      Array.from(
        element.getElementsByTagNameNS(
          Namespaces.HYPERVIEW,
          LOCAL_NAME.PICKER_ITEM,
        ),
      ),
    [element],
  );

  const onFocus = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'true');
    onUpdate(null, 'swap', element, { newElement });
    Behaviors.trigger('focus', newElement, onUpdate);
  }, [element, onUpdate]);

  const onBlur = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'false');
    onUpdate(null, 'swap', element, { newElement });
    Behaviors.trigger('blur', newElement, onUpdate);
  }, [element, onUpdate]);

  /**
   * Hides the picker without applying the chosen value.
   */
  const onCancel = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'false');
    newElement.removeAttribute('picker-value');
    onUpdate(null, 'swap', element, { newElement });
  }, [element, onUpdate]);

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  const onDone = useCallback(
    (newValue?: string) => {
      const pickerValue = newValue !== undefined ? newValue : getPickerValue();
      const value = getValue();
      const newElement = element.cloneNode(true) as Element;
      newElement.setAttribute('value', pickerValue);
      newElement.removeAttribute('picker-value');
      newElement.setAttribute('focused', 'false');
      onUpdate(null, 'swap', element, { newElement });

      const hasChanged = value !== pickerValue;
      if (hasChanged) {
        Behaviors.trigger('change', newElement, onUpdate);
      }
    },
    [element, getPickerValue, getValue, onUpdate],
  );

  const onChange = useCallback(
    (value: string | null | undefined) => {
      if (value === undefined) {
        onCancel();
      } else {
        onDone(value || '');
      }
    },
    [onCancel, onDone],
  );

  const style: Array<StyleSheet> = createStyleProp(element, stylesheets, {
    ...options,
    styleAttr: 'field-text-style',
  });
  const { testID, accessibilityLabel } = createTestProps(element);
  const value: DOMString | null | undefined = element.getAttribute('value');
  const placeholderTextColor:
    | DOMString
    | null
    | undefined = element.getAttribute('placeholderTextColor');
  if ([undefined, null, ''].includes(value) && placeholderTextColor) {
    style.push({ color: placeholderTextColor });
  }

  const fieldStyle: Array<StyleSheet> = createStyleProp(element, stylesheets, {
    ...options,
    styleAttr: 'field-style',
  });

  // Gets all of the <picker-item> elements. All picker item elements
  // with a value and label are turned into options for the picker.
  const items = getPickerItems();
  const children = items.filter(Boolean).map((item: Element) => {
    const l: DOMString | null | undefined = item.getAttribute('label');
    const v: DOMString | null | undefined = item.getAttribute('value');
    if (!l || typeof v !== 'string') {
      return null;
    }
    const enabled = ['', 'true', null].includes(item.getAttribute('enabled'));
    return (
      <Picker.Item
        key={l + v}
        enabled={enabled}
        label={l}
        style={{ fontSize: 16 }}
        value={v}
      />
    );
  });

  // If there are no items, or the first item has a value,
  // we need to add an empty option that acts as a placeholder.
  if (items.length > 0 && items[0].getAttribute('value') !== '') {
    children.unshift(
      <Picker.Item
        key="empty"
        // eslint-disable-next-line max-len
        // `enabled` needs to be true when the field is not focused, otherwise the the field will not be selectable
        // fix inspired by https://github.com/react-native-picker/picker/issues/95#issuecomment-935718568
        enabled={element.getAttribute('focused') !== 'true'}
        label={element.getAttribute('placeholder') || undefined}
        style={{ fontSize: 16 }}
        value=""
      />,
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={fieldStyle}
      testID={testID}
    >
      <Picker
        onBlur={onBlur}
        onFocus={onFocus}
        onValueChange={onChange}
        selectedValue={getPickerValue()}
        style={style}
      >
        {children}
      </Picker>
    </View>
  );
};

HvPickerField.namespaceURI = Namespaces.HYPERVIEW;
HvPickerField.localName = LOCAL_NAME.PICKER_FIELD;
HvPickerField.getFormInputValues = getNameValueFormInputValues;

export default HvPickerField;
