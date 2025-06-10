import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { DOMString, HvComponentProps } from 'hyperview/src/types';
import React, { useCallback, useMemo } from 'react';
import {
  createTestProps,
  getNameValueFormInputValues,
  useStyleProp,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
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
  const pickerValue = value;

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

  const isFocused = useMemo(
    (): boolean => element.getAttribute('focused') === 'true',
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
      const pValue = newValue !== undefined ? newValue : pickerValue;
      const newElement = element.cloneNode(true) as Element;
      newElement.setAttribute('value', pValue);
      newElement.removeAttribute('picker-value');
      newElement.setAttribute('focused', 'false');
      onUpdate(null, 'swap', element, { newElement });

      const hasChanged = value !== pValue;
      if (hasChanged) {
        Behaviors.trigger('change', newElement, onUpdate);
      }
    },
    [element, onUpdate, value, pickerValue],
  );

  const onChange = useCallback(
    (v: string | null | undefined) => {
      if (v === undefined) {
        onCancel();
      } else {
        onDone(v || '');
      }
    },
    [onCancel, onDone],
  );

  const fieldTextStyle = useStyleProp(element, stylesheets, {
    focused,
    pressed,
    pressedSelected,
    selected,
    styleAttr: 'field-text-style',
  });

  const { testID, accessibilityLabel } = useMemo(
    () => createTestProps(element),
    [element],
  );

  const placeholderTextColor: DOMString | null | undefined = useMemo(
    () => element.getAttribute('placeholderTextColor'),
    [element],
  );

  const style = useMemo(() => {
    if ([undefined, null, ''].includes(value) && placeholderTextColor) {
      return {
        ...fieldTextStyle,
        color: placeholderTextColor,
      };
    }
    return fieldTextStyle;
  }, [fieldTextStyle, placeholderTextColor, value]);

  const needsEmptyOption = useMemo(
    () => pickerItems.length > 0 && pickerItems[0].getAttribute('value') !== '',
    [pickerItems],
  );

  const placeholder = useMemo(
    () => element.getAttribute('placeholder') || undefined,
    [element],
  );

  const fieldStyle = useStyleProp(element, stylesheets, {
    focused,
    pressed,
    pressedSelected,
    selected,
    styleAttr: 'field-style',
  });

  // Gets all of the <picker-item> elements. All picker item elements
  // with a value and label are turned into options for the picker.
  const children = useMemo(() => {
    const items = pickerItems.reduce<Array<React.ReactNode>>((acc, item) => {
      const l = item.getAttribute('label');
      const v = item.getAttribute('value');
      if (!l || typeof v !== 'string') {
        return acc;
      }
      const enabled = ['', 'true', null].includes(item.getAttribute('enabled'));
      acc.push(
        <Picker.Item
          key={l + v}
          enabled={enabled}
          label={l}
          style={{ fontSize: 16 }}
          value={v}
        />,
      );
      return acc;
    }, []);

    // If there are no items, or the first item has a value,
    // we need to add an empty option that acts as a placeholder.
    if (needsEmptyOption) {
      items.unshift(
        <Picker.Item
          key="empty"
          // eslint-disable-next-line max-len
          // `enabled` needs to be true when the field is not focused, otherwise the the field will not be selectable
          // fix inspired by https://github.com/react-native-picker/picker/issues/95#issuecomment-935718568
          enabled={!isFocused}
          label={placeholder}
          style={{ fontSize: 16 }}
          value=""
        />,
      );
    }

    return items;
  }, [pickerItems, needsEmptyOption, isFocused, placeholder]);

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
        selectedValue={pickerValue}
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
