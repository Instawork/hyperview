import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  HvComponentProps,
  StyleSheet,
} from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import {
  createStyleProp,
  createTestProps,
  getNameValueFormInputValues,
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
export default class HvPickerField extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.PICKER_FIELD;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  getPickerInitialValue = (): string => {
    const value = this.getValue();
    const pickerItems: Element[] = this.getPickerItems();
    const valueExists = pickerItems.some(
      item => item.getAttribute('value') === value,
    );
    if (valueExists) {
      return value;
    }
    return pickerItems.length > 0
      ? pickerItems[0].getAttribute('value') || ''
      : '';
  };

  /**
   * Returns a string representing the value in the field.
   */
  getValue = (): string => this.props.element.getAttribute('value') || '';

  /**
   * Gets the label from the picker items for the given value.
   * If the value doesn't have a picker item, returns null.
   */
  getLabelForValue = (value: DOMString): string | null | undefined => {
    const pickerItemElements: HTMLCollectionOf<Element> = this.props.element.getElementsByTagNameNS(
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
        pickerItemElement.getAttribute('value') === value
      ) {
        item = pickerItemElement;
        break;
      }
    }
    return item ? item.getAttribute('label') : null;
  };

  /**
   * Returns a string representing the value in the picker.
   */
  getPickerValue = (): string =>
    this.props.element.getAttribute('picker-value') || '';

  getPickerItems = (): Element[] =>
    Array.from(
      this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      ),
    );

  /**
   * Shows the picker, defaulting to the field's value.
   * If the field is not set, use the first value in the picker.
   */
  onFieldPress = () => {
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'true');
    newElement.setAttribute('picker-value', this.getPickerInitialValue());
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    Behaviors.trigger('focus', newElement, this.props.onUpdate);
  };

  /**
   * Hides the picker without applying the chosen value.
   */
  onCancel = () => {
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'false');
    newElement.removeAttribute('picker-value');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    Behaviors.trigger('blur', newElement, this.props.onUpdate);
  };

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  onDone = () => {
    const pickerValue = this.getPickerValue();
    const value = this.getValue();
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('value', pickerValue);
    newElement.removeAttribute('picker-value');
    newElement.setAttribute('focused', 'false');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    const hasChanged = value !== pickerValue;
    if (hasChanged) {
      Behaviors.trigger('change', newElement, this.props.onUpdate);
    }
    Behaviors.trigger('blur', newElement, this.props.onUpdate);
  };

  /**
   * Updates the picker value while keeping the picker open.
   */
  setPickerValue = (value: string) => {
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('picker-value', value);
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  };

  /**
   * Returns true if the field is focused (and picker is showing).
   */
  isFocused = (): boolean =>
    this.props.element.getAttribute('focused') === 'true';

  render() {
    const style: Array<StyleSheet> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'field-text-style',
      },
    );
    const { testID, accessibilityLabel } = createTestProps(this.props.element);
    const value: DOMString | null | undefined = this.props.element.getAttribute(
      'value',
    );
    const placeholderTextColor:
      | DOMString
      | null
      | undefined = this.props.element.getAttribute('placeholderTextColor');
    if ([undefined, null, ''].includes(value) && placeholderTextColor) {
      style.push({ color: placeholderTextColor });
    }

    // Gets all of the <picker-item> elements. All picker item elements
    // with a value and label are turned into options for the picker.
    const children = this.getPickerItems()
      .filter(Boolean)
      .map((item: Element) => {
        const l: DOMString | null | undefined = item.getAttribute('label');
        const v: DOMString | null | undefined = item.getAttribute('value');
        if (!l || typeof v !== 'string') {
          return null;
        }
        return <Picker.Item key={l + v} label={l} value={v} />;
      });

    const focused = this.props.element.getAttribute('focused') === 'true';

    return (
      <Field
        element={this.props.element}
        focused={focused}
        onPress={this.onFieldPress}
        options={this.props.options}
        stylesheets={this.props.stylesheets}
        value={this.getLabelForValue(this.getValue())}
      >
        {focused ? (
          <Modal
            element={this.props.element}
            focused={focused}
            onModalCancel={this.onCancel}
            onModalDone={this.onDone}
            onUpdate={this.props.onUpdate}
            options={this.props.options}
            stylesheets={this.props.stylesheets}
          >
            <View accessibilityLabel={accessibilityLabel} testID={testID}>
              <Picker
                onValueChange={this.setPickerValue}
                selectedValue={this.getPickerValue()}
                style={style}
              >
                {children}
              </Picker>
            </View>
          </Modal>
        ) : null}
      </Field>
    );
  }
}
