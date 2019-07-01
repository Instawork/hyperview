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
  StyleSheets,
} from 'hyperview/src/types';
import {
  DatePickerAndroid,
  DatePickerIOS,
  Modal,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type {
  Options as DatePickerAndroidOptions,
  DatePickerOpenAction,
} from 'react-native/Libraries/Components/DatePickerAndroid/DatePickerAndroidTypes';
import type { Props, State } from './types';
import React, { PureComponent } from 'react';
import { createProps, createStyleProp } from 'hyperview/src/services';
import { FormatDateContext } from 'hyperview/src';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Node as ReactNode } from 'react';
import type { StyleSheet as StyleSheetType } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import styles from './styles';

/**
 * A date field renders a form field with ISO date fields (YYYY-MM-DD).
 * Focusing the field brings up a system-appropriate UI for date selection:
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, pressing the field brings up the system date picker modal.
 */
export default class HvDateField extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.DATE_FIELD;
  static contextType = FormatDateContext;
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    const element: Element = props.element;
    const stringValue: ?DOMString = element.getAttribute('value');
    const value: ?Date = this.createDateFromString(stringValue);
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

  componentDidUpdate = async (prevProps: Props, prevState: State) => {
    if (Platform.OS === 'android') {
      if (!prevState.fieldPressed && this.state.fieldPressed) {
        this.showPickerAndroid();
      }
    }
  };

  /**
   * Given a ISO date string (YYYY-MM-DD), returns a Date object. If the string
   * cannot be parsed or is falsey, returns null.
   */
  createDateFromString = (value: ?string): ?Date => {
    if (!value) {
      return null;
    }
    const [year, month, day] = value.split('-').map(p => parseInt(p, 10));
    return new Date(year, month - 1, day);
  };

  /**
   * Given a Date object, returns an ISO date string (YYYY-MM-DD). If the Date
   * object is null, returns an empty string.
   */
  createStringFromDate = (date: ?Date): string => {
    if (!date) {
      return '';
    }
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${year}-${month}-${day}`;
  };

  toggleFieldPress = () => {
    this.setState({ fieldPressed: !this.state.fieldPressed });
  };

  toggleCancelPress = () => {
    this.setState({ cancelPressed: !this.state.cancelPressed });
  };

  toggleSavePress = () => {
    this.setState({ donePressed: !this.state.donePressed });
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
    this.setState({
      focused: false,
      value: this.state.pickerValue,
    });
    // In addition to updating the state, we update the XML element to ensure the
    // selected value gets serialized in the parent form.
    element.setAttribute(
      'value',
      this.createStringFromDate(this.state.pickerValue),
    );
  };

  /**
   * Date picker on Android is implemented as an async function.
   * This gets triggered when field pressed state changes from false to true.
   * This is used on Android only.
   */
  showPickerAndroid = async () => {
    const maxValue: ?DOMString = this.props.element.getAttribute('max');
    const minValue: ?DOMString = this.props.element.getAttribute('min');
    const options: DatePickerAndroidOptions = {
      date: this.state.pickerValue,
      maxDate: this.createDateFromString(maxValue),
      minDate: this.createDateFromString(minValue),
    };
    const openAction: DatePickerOpenAction = await DatePickerAndroid.open(
      options,
    );
    const { action, year, month, day } = openAction;
    if (action === DatePickerAndroid.dateSetAction) {
      // Selected year, month (0-11), day
      this.setState({ pickerValue: new Date(year, month, day) });
      this.onModalDone();
    } else {
      this.onModalCancel();
    }
  };

  /**
   * Renders the date picker component, with the given min and max dates.
   * This is used on iOS only.
   */
  renderPickeriOS = (): ReactNode => {
    const minValue: ?DOMString = this.props.element.getAttribute('min');
    const maxValue: ?DOMString = this.props.element.getAttribute('max');
    const minDate: ?Date = this.createDateFromString(minValue);
    const maxDate: ?Date = this.createDateFromString(maxValue);
    const onDateChange = (value: Date) => {
      this.setState({ pickerValue: value });
    };

    const props: Object = {
      date: this.state.pickerValue,
      mode: 'date',
      onDateChange,
    };
    if (minDate) {
      props.minimumDate = minDate;
    }
    if (maxDate) {
      props.maximumDate = maxDate;
    }

    return <DatePickerIOS {...props} />;
  };

  /**
   * Renders a bottom sheet with cancel/done buttons and a picker component.
   * Uses styles defined on the <picker-field> element for the modal and buttons.
   * This is used on iOS only.
   */
  renderPickerModaliOS = (): ReactNode => {
    if (Platform.OS === 'android') {
      return null;
    }

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
                <Text style={cancelTextStyle}>{cancelLabel}</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPressIn={this.toggleSavePress}
                onPressOut={this.toggleSavePress}
                onPress={this.onModalDone}
              >
                <Text style={doneTextStyle}>{doneLabel}</Text>
              </TouchableWithoutFeedback>
            </View>
            {this.renderPickeriOS()}
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

    const iosPicker =
      Platform.OS === 'ios' ? this.renderPickerModaliOS() : null;

    return (
      <TouchableWithoutFeedback
        onPressIn={this.toggleFieldPress}
        onPressOut={this.toggleFieldPress}
        onPress={this.onFieldPress}
      >
        <View {...props}>
          <FormatDateContext.Consumer>
            {formatter => this.renderLabel(formatter)}
          </FormatDateContext.Consumer>
          {iosPicker}
        </View>
      </TouchableWithoutFeedback>
    );
  };
}
