// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// $FlowFixMe: importing code from TypeScript
import * as Contexts from 'hyperview/src/contexts';
import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  Element,
  HvComponentProps,
  StyleSheet as StyleSheetType,
} from 'hyperview/src/types';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// $FlowFixMe: update Flow to support typings for React Hooks
import React, { PureComponent, useState } from 'react';
import {
  createProps,
  createStyleProp,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import DateTimePicker from 'hyperview/src/core/components/date-time-picker';
import FieldLabel from './field-label';
import type { FieldProps } from './types';
import { LOCAL_NAME } from 'hyperview/src/types';
import ModalButton from './modal-button';
import type { Node as ReactNode } from 'react';
import styles from './styles';

/**
 * The input field component. This is a box with text in it.
 * Tapping the box focuses the field and brings up the date picker.
 */
const Field = (props: FieldProps) => {
  // Styles selected based on pressed state of the field.
  const [pressed, setPressed] = useState(false);

  // Create the props (including styles) for the box of the input field.
  const viewProps = createProps(props.element, props.stylesheets, {
    ...props.options,
    focused: props.focused,
    pressed,
    styleAttr: 'field-style',
  });

  const labelStyle: StyleSheetType = StyleSheet.flatten(
    createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      focused: props.focused,
      pressed,
      styleAttr: 'field-text-style',
    }),
  );

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View {...viewProps}>
        <Contexts.DateFormatContext.Consumer>
          {formatter => (
            <FieldLabel
              focused={props.focused}
              formatter={formatter}
              labelFormat={props.element.getAttribute('label-format')}
              placeholder={props.element.getAttribute('placeholder')}
              placeholderTextColor={props.element.getAttribute(
                'placeholderTextColor',
              )}
              pressed={pressed}
              style={labelStyle}
              value={props.value}
            />
          )}
        </Contexts.DateFormatContext.Consumer>
        {props.children}
      </View>
    </TouchableWithoutFeedback>
  );
};

/**
 * A date field renders a form field with ISO date fields (YYYY-MM-DD).
 * Focusing the field brings up a system-appropriate UI for date selection:
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, pressing the field brings up the system date picker modal.
 */
export default class HvDateField extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.DATE_FIELD;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  props: HvComponentProps;

  /**
   * Given a Date object, returns an ISO date string (YYYY-MM-DD). If the Date
   * object is null, returns an empty string.
   */
  static createStringFromDate = (date: ?Date): string => {
    if (!date) {
      return '';
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  /**
   * Given a ISO date string (YYYY-MM-DD), returns a Date object. If the string
   * cannot be parsed or is falsey, returns null.
   */
  static createDateFromString = (value: ?string): ?Date => {
    if (!value) {
      return null;
    }
    const [year, month, day] = value.split('-').map(p => parseInt(p, 10));
    return new Date(year, month - 1, day);
  };

  /**
   * Shows the picker, defaulting to the field's value. If the field is not set, use today's date in the picker.
   */
  onFieldPress = () => {
    const newElement = this.props.element.cloneNode(true);
    const value: string =
      this.props.element.getAttribute('value') ||
      HvDateField.createStringFromDate(new Date());

    // Focus the field and populate the picker with the field's value.
    newElement.setAttribute('focused', 'true');
    newElement.setAttribute('picker-value', value);
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    this.triggerBehaviors(newElement, 'focus');
  };

  /**
   * Hides the picker without applying the chosen value.
   */
  onModalCancel = () => {
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('focused', 'false');
    newElement.removeAttribute('picker-value');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    this.triggerBehaviors(newElement, 'blur');
  };

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  onModalDone = (newValue: ?Date) => {
    const value = HvDateField.createStringFromDate(newValue);
    const hasChanged = this.props.element.getAttribute('value') !== value;
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('value', value);
    newElement.removeAttribute('picker-value');
    newElement.setAttribute('focused', 'false');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    if (hasChanged) {
      this.triggerBehaviors(newElement, 'change');
    }
    this.triggerBehaviors(newElement, 'blur');
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
  setPickerValue = (value: ?Date) => {
    const formattedValue: string = HvDateField.createStringFromDate(value);
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('picker-value', formattedValue);
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  };

  /**
   * Returns true if the field is focused (and picker is showing).
   */
  isFocused = (): boolean =>
    this.props.element.getAttribute('focused') === 'true';

  /**
   * Returns a Date object representing the value in the picker.
   */
  getPickerValue = (): ?Date =>
    HvDateField.createDateFromString(
      this.props.element.getAttribute('picker-value'),
    );

  /**
   * Returns a Date object representing the value in the field.
   */
  getValue = (): ?Date =>
    HvDateField.createDateFromString(this.props.element.getAttribute('value'));

  /**
   * Renders the date picker component, with the given min and max dates.
   * Used for both iOS and Android. However, on iOS this component is rendered inline,
   * and on Android it's rendered as a modal. Thus, the on-change callback needs to be
   * handled differently in each Platform, and on iOS we need to wrap this component
   * in our own modal for consistency.
   */
  renderPicker = (onChange: (evt: Event, date?: Date) => void): ReactNode => {
    const minValue: ?DOMString = this.props.element.getAttribute('min');
    const maxValue: ?DOMString = this.props.element.getAttribute('max');
    const minDate: ?Date = HvDateField.createDateFromString(minValue);
    const maxDate: ?Date = HvDateField.createDateFromString(maxValue);
    const displayMode: ?DOMString = this.props.element.getAttribute('mode');
    const locale: ?DOMString = this.props.element.getAttribute('locale');
    const props: Object = {
      display: displayMode,
      locale,
      mode: 'date',
      onChange,
      value: this.getPickerValue(),
    };
    if (minDate) {
      props.minimumDate = minDate;
    }
    if (maxDate) {
      props.maximumDate = maxDate;
    }

    return <DateTimePicker {...props} />;
  };

  /**
   * Unlike iOS, the Android picker natively uses a modal. So we don't need
   * to wrap it in an extra component, just render it when we want the modal
   * to appear.
   */
  renderPickerModalAndroid = (): ?ReactNode => {
    if (!this.isFocused()) {
      return null;
    }
    const onChange = (evt: Event, date?: Date) => {
      if (date === undefined) {
        // Modal was dismissed (cancel button)
        this.onModalCancel();
      } else {
        this.onModalDone(date);
      }
    };
    return this.renderPicker(onChange);
  };

  /**
   * Renders a bottom sheet with cancel/done buttons and a picker component.
   * Uses styles defined on the <picker-field> element for the modal and buttons.
   * This is used on iOS only.
   */
  renderPickerModaliOS = (): ReactNode => {
    const modalStyle: Array<StyleSheetType> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'modal-style',
      },
    );

    const cancelLabel: string =
      this.props.element.getAttribute('cancel-label') || 'Cancel';
    const doneLabel: string =
      this.props.element.getAttribute('done-label') || 'Done';

    const getTextStyle = (pressed: boolean): Array<StyleSheetType> =>
      createStyleProp(this.props.element, this.props.stylesheets, {
        ...this.props.options,
        pressed,
        styleAttr: 'modal-text-style',
      });

    const onChange = (evt: Event, date?: Date) => {
      this.setPickerValue(date);
    };

    return (
      <Modal
        animationType="slide"
        onRequestClose={this.onModalCancel}
        transparent
        visible={this.isFocused()}
      >
        <View style={styles.modalWrapper}>
          <View style={modalStyle}>
            <View style={styles.modalActions}>
              <ModalButton
                getStyle={getTextStyle}
                label={cancelLabel}
                onPress={this.onModalCancel}
              />
              <ModalButton
                getStyle={getTextStyle}
                label={doneLabel}
                onPress={() => this.onModalDone(this.getPickerValue())}
              />
            </View>
            {this.renderPicker(onChange)}
          </View>
        </View>
      </Modal>
    );
  };

  /**
   * Renders the field (view and text label).
   * Pressing the field will focus it and:
   * - on iOS, bring up a bottom sheet with date picker
   * - on Android, show the system date picker
   */
  render = (): ReactNode => {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }

    const focused: boolean = this.isFocused();
    const picker =
      Platform.OS === 'ios'
        ? this.renderPickerModaliOS()
        : this.renderPickerModalAndroid();

    return (
      <Field
        element={this.props.element}
        focused={focused}
        onPress={this.onFieldPress}
        options={this.props.options}
        stylesheets={this.props.stylesheets}
        value={this.getValue()}
      >
        {picker}
      </Field>
    );
  };
}
