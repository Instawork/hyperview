// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  Element,
  HvComponentOptions,
  HvComponentProps,
  StyleSheets,
} from 'hyperview/src/types';
import {
  Modal,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import { createProps, createStyleProp } from 'hyperview/src/services';
import { DateFormatContext } from 'hyperview/src';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Node as ReactNode } from 'react';
import type { State } from './types';
import type { StyleSheet as StyleSheetType } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import styles from './styles';

/**
 * A date field renders a form field with ISO date fields (YYYY-MM-DD).
 * Focusing the field brings up a system-appropriate UI for date selection:
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, pressing the field brings up the system date picker modal.
 */
export default class HvDateField extends PureComponent<
  HvComponentProps,
  State,
> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.DATE_FIELD;
  static localNameAliases = [];
  props: HvComponentProps;
  state: State;

  constructor(props: HvComponentProps) {
    super(props);
    const element: Element = props.element;
    const stringValue: ?DOMString = element.getAttribute('value');
    const value: ?Date = HvDateField.createDateFromString(stringValue);
    const pickerValue: Date = value || new Date();
    this.state = {
      // Date that's selected in the field. Can be null.
      value,
      // Date shown when the picker opens, must be set to a default to display.
      pickerValue,
      focused: false,
      fieldPressed: false,
      donePressed: false,
      cancelPressed: false,
    };
  }

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

  static getDerivedStateFromProps(
    nextProps: HvComponentProps,
    prevState: State,
  ): State {
    const { element } = nextProps;
    if (element.hasAttribute('value')) {
      const newValue = element.getAttribute('value') || '';
      const newDate = HvDateField.createDateFromString(newValue);

      // NOTE(adam): We convert from date to strings for the comparison to normalize the representation.
      if (
        HvDateField.createStringFromDate(newDate) !==
        HvDateField.createStringFromDate(prevState.value)
      ) {
        const { focused, fieldPressed, donePressed, cancelPressed } = prevState;
        return {
          cancelPressed,
          donePressed,
          fieldPressed,
          focused,
          pickerValue: newDate || new Date(),
          value: newDate,
        };
      }
    }
    return prevState;
  }

  toggleFieldPress = () => {
    this.setState(prevState => ({ fieldPressed: !prevState.fieldPressed }));
  };

  toggleCancelPress = () => {
    this.setState(prevState => ({ cancelPressed: !prevState.cancelPressed }));
  };

  toggleSavePress = () => {
    this.setState(prevState => ({ donePressed: !prevState.donePressed }));
  };

  /**
   * Shows the picker, defaulting to the field's value.
   */
  onFieldPress = () => {
    this.setState({
      focused: true,
    });
  };

  /**
   * Hides the picker without applying the chosen value.
   */
  onModalCancel = () => {
    this.setState({
      focused: false,
    });
  };

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  onModalDone = () => {
    const element: Element = this.props.element;
    // In addition to updating the state, we update the XML element to ensure the
    // selected value gets serialized in the parent form.
    // The value in the component state will be derived from the element prop
    element.setAttribute(
      'value',
      HvDateField.createStringFromDate(this.state.pickerValue),
    );

    // Hide the modal
    this.setState({
      focused: false,
    });
  };

  /**
   * Renders the date picker component, with the given min and max dates.
   * This is used on iOS only.
   */
  renderPicker = (onChange: (evt: Event, date: Date) => void): ReactNode => {
    const minValue: ?DOMString = this.props.element.getAttribute('min');
    const maxValue: ?DOMString = this.props.element.getAttribute('max');
    const minDate: ?Date = HvDateField.createDateFromString(minValue);
    const maxDate: ?Date = HvDateField.createDateFromString(maxValue);
    const props: Object = {
      value: this.state.pickerValue,
      mode: 'date',
      onChange,
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
    if (!this.state.focused) {
      return null;
    }
    const onChange = (evt: Event, date: Date) => {
      if (date === undefined) {
        // Modal was dismissed (cancel button)
        this.onModalCancel();
      } else {
        this.setState({ pickerValue: date });
        this.onModalDone();
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
    const element: Element = this.props.element;
    const stylesheets: StyleSheets = this.props.stylesheets;
    const options: HvComponentOptions = this.props.options;
    const modalStyle: Array<StyleSheetType<*>> = createStyleProp(
      element,
      stylesheets,
      {
        ...options,
        styleAttr: 'modal-style',
      },
    );
    const cancelTextStyle: Array<StyleSheetType<*>> = createStyleProp(
      element,
      stylesheets,
      {
        ...options,
        pressed: this.state.cancelPressed,
        styleAttr: 'modal-text-style',
      },
    );
    const doneTextStyle: Array<StyleSheetType<*>> = createStyleProp(
      element,
      stylesheets,
      {
        ...options,
        pressed: this.state.donePressed,
        styleAttr: 'modal-text-style',
      },
    );
    const cancelLabel: string =
      element.getAttribute('cancel-label') || 'Cancel';
    const doneLabel: string = element.getAttribute('done-label') || 'Done';

    // On iOS, store the changed value in the temp state until the modal
    // is saved.
    const onChange = (evt: Event, date: Date) => {
      this.setState({ pickerValue: date });
    };

    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.focused}
        onRequestClose={this.onModalCancel}
      >
        <View style={styles.modalWrapper}>
          <View style={modalStyle}>
            <View style={styles.modalActions}>
              <TouchableWithoutFeedback
                onPressIn={this.toggleCancelPress}
                onPressOut={this.toggleCancelPress}
                onPress={this.onModalCancel}
              >
                <View>
                  <Text style={cancelTextStyle}>{cancelLabel}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPressIn={this.toggleSavePress}
                onPressOut={this.toggleSavePress}
                onPress={this.onModalDone}
              >
                <View>
                  <Text style={doneTextStyle}>{doneLabel}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            {this.renderPicker(onChange)}
          </View>
        </View>
      </Modal>
    );
  };

  /**
   * Renders the text part of the field. If the field has a selected value,
   * use the provided format to display the value. Otherwise, uses the
   * placeholder value and style.
   */
  renderLabel = (formatter: Function): ReactNode => {
    const element: Element = this.props.element;
    const value: ?Date = this.state.value;
    const stylesheets: StyleSheets = this.props.stylesheets;
    const options: HvComponentOptions = this.props.options;
    const placeholderTextColor: ?DOMString = element.getAttribute(
      'placeholderTextColor',
    );
    const focused: boolean = this.state.focused;
    const pressed: boolean = this.state.fieldPressed;
    const fieldTextStyle = createStyleProp(element, stylesheets, {
      ...options,
      focused,
      pressed,
      styleAttr: 'field-text-style',
    });
    if (!value && placeholderTextColor) {
      fieldTextStyle.push({ color: placeholderTextColor });
    }

    const labelFormat = element.getAttribute('label-format');
    const label: string = value
      ? formatter(value, labelFormat)
      : element.getAttribute('placeholder') || '';

    return <Text style={fieldTextStyle}>{label}</Text>;
  };

  /**
   * Renders the field (view and text label).
   * Pressing the field will focus it and:
   * - on iOS, bring up a bottom sheet with date picker
   * - on Android, show the system date picker
   */
  render = (): ReactNode => {
    const element: Element = this.props.element;
    const stylesheets: StyleSheets = this.props.stylesheets;
    const options: HvComponentOptions = this.props.options;
    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const focused: boolean = this.state.focused;
    const pressed: boolean = this.state.fieldPressed;
    const props = createProps(element, stylesheets, {
      ...options,
      focused,
      pressed,
      styleAttr: 'field-style',
    });

    const picker =
      Platform.OS === 'ios'
        ? this.renderPickerModaliOS()
        : this.renderPickerModalAndroid();

    return (
      <TouchableWithoutFeedback
        onPressIn={this.toggleFieldPress}
        onPressOut={this.toggleFieldPress}
        onPress={this.onFieldPress}
      >
        <View {...props}>
          <DateFormatContext.Consumer>
            {formatter => this.renderLabel(formatter)}
          </DateFormatContext.Consumer>
          {picker}
        </View>
      </TouchableWithoutFeedback>
    );
  };
}
