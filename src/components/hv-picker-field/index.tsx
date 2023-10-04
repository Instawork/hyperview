/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
import { LOCAL_NAME } from 'hyperview/src/types';
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

  /**
   * Returns a string representing the value in the field.
   */
  getValue = (): string => this.props.element.getAttribute('value') || '';

  /**
   * Returns a string representing the value in the picker.
   */
  getPickerValue = (): string => this.props.element.getAttribute('value') || '';

  getPickerItems = (): Element[] =>
    Array.from(
      this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      ),
    );
  };

  onUpdate = (newElement: Element) => {
    if (this.props.onUpdate) {
      this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    }
  };

  onFocus = () => {
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'true');
    this.onUpdate(newElement);
    Behaviors.trigger('focus', newElement, this.props.onUpdate);
  };

  onBlur = () => {
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'false');
    this.onUpdate(newElement);
    Behaviors.trigger('blur', newElement, this.props.onUpdate);
  };

  /**
   * Hides the picker without applying the chosen value.
   */
  onCancel = () => {
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'false');
    newElement.removeAttribute('picker-value');
    this.onUpdate(newElement);
  };

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  onDone = (newValue?: string) => {
    const pickerValue =
      newValue !== undefined ? newValue : this.getPickerValue();
    const value = this.getValue();
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('value', pickerValue);
    newElement.removeAttribute('picker-value');
    newElement.setAttribute('focused', 'false');
    this.onUpdate(newElement);

    const hasChanged = value !== pickerValue;
    if (hasChanged) {
      Behaviors.trigger('change', newElement, this.props.onUpdate);
    }
  };

  render() {
    const onChange = (value: string | null | undefined) => {
      if (value === undefined) {
        this.onCancel();
      } else {
        this.onDone(value || '');
      }
    };

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

    const fieldStyle: Array<StyleSheet> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'field-style',
      },
    );

    // Gets all of the <picker-item> elements. All picker item elements
    // with a value and label are turned into options for the picker.
    const items = this.getPickerItems();
    const children = items.filter(Boolean).map((item: Element) => {
      const l: DOMString | null | undefined = item.getAttribute('label');
      const v: DOMString | null | undefined = item.getAttribute('value');
      if (!l || typeof v !== 'string') {
        return null;
      }
      const enabled = ['', 'true', null].includes(item.getAttribute('enabled'));
      return <Picker.Item key={l + v} enabled={enabled} label={l} value={v} />;
    });

    // If there are no items, or the first item has a value,
    // we need to add an empty option that acts as a placeholder.
    if (items.length > 0 && items[0].getAttribute('value') !== '') {
      const label = this.props.element.getAttribute('placeholder') || undefined;
      children.unshift(
        <Picker.Item
          key="empty"
          // eslint-disable-next-line max-len
          // `enabled` needs to be true when the field is not focused, otherwise the the field will not be selectable
          // fix inspired by https://github.com/react-native-picker/picker/issues/95#issuecomment-935718568
          enabled={this.props.element.getAttribute('focused') !== 'true'}
          label={this.props.element.getAttribute('placeholder') || undefined}
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
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onValueChange={onChange}
          selectedValue={this.getPickerValue()}
          style={style}
        >
          {children}
        </Picker>
      </View>
    );
  }
}
