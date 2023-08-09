// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  Element,
  HvComponentProps,
  StyleSheet,
} from 'hyperview/src/types';
import { Platform, View } from 'react-native';
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
import type { PickerProps } from './types';
import type { Node as ReactNode } from 'react';

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
   * Shows the picker, defaulting to the field's value. If the field is not set, use the first value in the picker.
   */
  onFieldPress = () => {
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('focused', 'true');
    newElement.setAttribute('picker-value', this.getPickerInitialValue());
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    this.triggerBehaviors(newElement, 'focus');
  };

  /**
   * Hides the picker without applying the chosen value.
   */
  onCancel = () => {
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('focused', 'false');
    newElement.removeAttribute('picker-value');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    // Android has a dedicated blur handler
    if (Platform.OS !== 'android') {
      this.triggerBehaviors(newElement, 'blur');
    }
  };

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  onDone = (newValue?: string) => {
    const pickerValue =
      newValue !== undefined ? newValue : this.getPickerValue();
    const value = this.getValue();
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('value', pickerValue);
    newElement.removeAttribute('picker-value');
    newElement.setAttribute('focused', 'false');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });

    const hasChanged = value !== pickerValue;
    if (hasChanged) {
      this.triggerBehaviors(newElement, 'change');
    }
    // Android has a dedicated blur handler
    if (Platform.OS !== 'android') {
      this.triggerBehaviors(newElement, 'blur');
    }
  };

  triggerBehaviors = (newElement: Element, triggerName: string) => {
    const behaviorElements = Dom.getBehaviorElements(newElement);
    const matchingBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === triggerName,
    );
    matchingBehaviors.forEach(behaviorElement => {
      const href = behaviorElement.getAttribute('href');
      const action = behaviorElement.getAttribute('action');
      const verb = behaviorElement.getAttribute('verb');
      const targetId = behaviorElement.getAttribute('target');
      const showIndicatorIds = behaviorElement.getAttribute('show-during-load');
      const hideIndicatorIds = behaviorElement.getAttribute('hide-during-load');
      const delay = behaviorElement.getAttribute('delay');
      const once = behaviorElement.getAttribute('once');
      this.props.onUpdate(href, action, newElement, {
        behaviorElement,
        delay,
        hideIndicatorIds,
        once,
        showIndicatorIds,
        targetId,
        verb,
      });
    });
  };

  /**
   * Updates the picker value while keeping the picker open.
   */
  setPickerValue = (value: string) => {
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute(
      Platform.OS === 'android' ? 'value' : 'picker-value',
      value,
    );
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  };

  /**
   * Returns true if the field is focused (and picker is showing).
   */
  isFocused = (): boolean =>
    this.props.element.getAttribute('focused') === 'true';

  /**
   * Returns a string representing the value in the picker.
   */
  getPickerValue = (): string =>
    this.props.element.getAttribute(
      Platform.OS === 'android' ? 'value' : 'picker-value',
    ) || '';

  getPickerItems = (): Element[] =>
    Array.from(
      // $FlowFixMe: flow thinks `element` is a `Node` instead of an `Element`
      this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      ),
    );

  getPickerInitialValue = (): string => {
    const value = this.getValue();
    const pickerItems = this.getPickerItems();
    if (pickerItems.map(item => item.getAttribute('value')).includes(value)) {
      return value;
    }
    if (pickerItems.length > 0) {
      return pickerItems[0].getAttribute('value') || '';
    }
    return '';
  };

  /**
   * Returns a string representing the value in the field.
   */
  getValue = (): string => this.props.element.getAttribute('value') || '';

  /**
   * Renders the picker component.
   */
  PickerWrapper = (props: PickerProps): ReactNode => {
    const style: Array<StyleSheet> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'field-text-style',
      },
    );
    const { testID, accessibilityLabel } = createTestProps(this.props.element);
    const value: ?DOMString = this.props.element.getAttribute('value');
    const placeholderTextColor: ?DOMString = this.props.element.getAttribute(
      'placeholderTextColor',
    );
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
    const children = this.getPickerItems()
      .filter(Boolean)
      .map((item: Element) => {
        const l: ?DOMString = item.getAttribute('label');
        const v: ?DOMString = item.getAttribute('value');
        if (!l || typeof v !== 'string') {
          return null;
        }
        return <Picker.Item key={l + v} label={l} value={v} />;
      });

    return (
      <View
        accessibilityLabel={accessibilityLabel}
        style={fieldStyle}
        testID={testID}
      >
        <Picker
          onBlur={() => this.triggerBehaviors(this.props.element, 'blur')}
          onFocus={() => this.triggerBehaviors(this.props.element, 'focus')}
          onValueChange={props.onChange}
          selectedValue={this.getPickerValue()}
          style={style}
        >
          {children}
        </Picker>
      </View>
    );
  };

  Content = () => {
    const { PickerWrapper } = this;

    /**
     * On iOS this component is rendered inline, and on Android it's rendered as a modal.
     * Thus, on iOS we need to wrap this component in our own modal for consistency.
     */
    if (Platform.OS === 'ios') {
      return (
        <Field
          element={this.props.element}
          focused={this.isFocused()}
          onPress={this.onFieldPress}
          options={this.props.options}
          stylesheets={this.props.stylesheets}
          value={this.getValue()}
        >
          {this.isFocused() ? (
            <Modal
              element={this.props.element}
              isFocused={this.isFocused}
              onModalCancel={this.onCancel}
              onModalDone={this.onDone}
              onUpdate={this.props.onUpdate}
              options={this.props.options}
              stylesheets={this.props.stylesheets}
            >
              <PickerWrapper onChange={this.setPickerValue} />
            </Modal>
          ) : null}
        </Field>
      );
    }
    const onChange = (value: ?string) => {
      if (value === undefined) {
        this.onCancel();
      } else {
        this.onDone(value || '');
      }
    };

    return <PickerWrapper onChange={onChange} />;
  };

  /**
   * Renders the field (view and text label).
   * Pressing the field will focus it and:
   * - on iOS, bring up a bottom sheet with picker
   * - on Android, show the system picker
   */
  render = (): ReactNode => {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }

    const { Content } = this;

    return <Content />;
  };
}
