import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { DOMString, HvComponentProps } from 'hyperview/src/types';
import React, { useCallback } from 'react';
import Field from './field';
import { LOCAL_NAME } from 'hyperview/src/types';
import Picker from 'hyperview/src/components/picker';
import SystemPicker from './picker';
import { getNameValueFormInputValues } from 'hyperview/src/services';

/**
 * A picker field renders a form field with values that come from a pre-defined list.
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, pressing the field brings up the system picker dialog.
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

  /**
   * Gets the label from the picker items for the given value.
   * If the value doesn't have a picker item, returns null.
   */
  const getLabelForValue = useCallback(
    (value: DOMString): string | null | undefined => {
      const item = getPickerItems().find(
        pickerItem => pickerItem.getAttribute('value') === value,
      );
      return item ? item.getAttribute('label') : null;
    },
    [getPickerItems],
  );

  /**
   * Returns true if the field is focused (and picker is showing).
   */
  const isFocused = useCallback(
    (): boolean => element.getAttribute('focused') === 'true',
    [element],
  );

  /**
   * Shows the picker.
   */
  const onFieldPress = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'true');
    onUpdate(null, 'swap', element, { newElement });
    Behaviors.trigger('focus', newElement, onUpdate);
  }, [element, onUpdate]);

  /**
   * Hides the picker without applying the chosen value.
   */
  const onCancel = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'false');
    onUpdate(null, 'swap', element, { newElement });
    Behaviors.trigger('blur', newElement, onUpdate);
  }, [element, onUpdate]);

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  const onDone = useCallback(
    (pickerValue: string) => {
      const value = getValue();
      const newElement = element.cloneNode(true) as Element;
      newElement.setAttribute('value', pickerValue);
      newElement.setAttribute('focused', 'false');
      onUpdate(null, 'swap', element, { newElement });

      Behaviors.trigger('submit', newElement, onUpdate);

      const hasChanged = value !== pickerValue;
      if (hasChanged) {
        Behaviors.trigger('change', newElement, onUpdate);
      }
      Behaviors.trigger('blur', newElement, onUpdate);
    },
    [element, getValue, onUpdate],
  );

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
        label={element.getAttribute('placeholder') || undefined}
        style={{ fontSize: 16 }}
        value=""
      />,
    );
  }

  return (
    <Field
      element={element}
      focused={isFocused()}
      onPress={onFieldPress}
      options={options}
      stylesheets={stylesheets}
      value={getLabelForValue(getValue())}
    >
      <SystemPicker
        focused={isFocused()}
        onCancel={onCancel}
        onDone={onDone}
        value={getValue()}
      >
        {children}
      </SystemPicker>
    </Field>
  );
};

HvPickerField.namespaceURI = Namespaces.HYPERVIEW;
HvPickerField.localName = LOCAL_NAME.PICKER_FIELD;
HvPickerField.getFormInputValues = getNameValueFormInputValues;

export default HvPickerField;
