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
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import DateTimePicker from 'hyperview/src/core/components/date-time-picker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Field from './field';
import { LOCAL_NAME } from 'hyperview/src/types';
import Modal from 'hyperview/src/core/components/modal';
import type { PickerProps } from './types';
import { Platform } from 'react-native';
import { getNameValueFormInputValues } from 'hyperview/src/services';

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

  /**
   * Given a Date object, returns an ISO date string (YYYY-MM-DD). If the Date
   * object is null, returns an empty string.
   */
  static createStringFromDate = (date: Date | null | undefined): string => {
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
  static createDateFromString = (
    value: string | null | undefined,
  ): Date | null => {
    if (!value) {
      return null;
    }
    const [year, month, day] = value.split('-').map(p => parseInt(p, 10));
    return new Date(year, month - 1, day);
  };

  /**
   * Shows the picker, defaulting to the field's value.
   * If the field is not set, use today's date in the picker.
   */
  onFieldPress = () => {
    const newElement = this.props.element.cloneNode(true) as Element;
    const value: string =
      this.props.element.getAttribute('value') ||
      HvDateField.createStringFromDate(new Date());

    // Focus the field and populate the picker with the field's value.
    newElement.setAttribute('focused', 'true');
    newElement.setAttribute('picker-value', value);
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
  onDone = (newValue?: Date) => {
    const pickerValue =
      newValue !== undefined ? newValue : this.getPickerValue();
    const value = HvDateField.createStringFromDate(pickerValue);
    const hasChanged = this.props.element.getAttribute('value') !== value;
    const newElement = this.props.element.cloneNode(true) as Element;
    newElement.setAttribute('value', value);
    newElement.removeAttribute('picker-value');
    newElement.setAttribute('focused', 'false');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
    if (hasChanged) {
      Behaviors.trigger('change', newElement, this.props.onUpdate);
    }
    Behaviors.trigger('blur', newElement, this.props.onUpdate);
  };

  /**
   * Updates the picker value while keeping the picker open.
   */
  setPickerValue = (value: Date | null | undefined) => {
    const formattedValue: string = HvDateField.createStringFromDate(value);
    const newElement = this.props.element.cloneNode(true) as Element;
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
  getPickerValue = (): Date | null | undefined =>
    HvDateField.createDateFromString(
      this.props.element.getAttribute('picker-value'),
    );

  /**
   * Returns a Date object representing the value in the field.
   */
  getValue = (): Date | null | undefined =>
    HvDateField.createDateFromString(this.props.element.getAttribute('value'));

  /**
   * Renders the date picker component, with the given min and max dates.
   */
  Picker = (props: PickerProps): JSX.Element => {
    const minValue:
      | DOMString
      | null
      | undefined = this.props.element.getAttribute('min');
    const maxValue:
      | DOMString
      | null
      | undefined = this.props.element.getAttribute('max');
    const minDate: Date | null | undefined = HvDateField.createDateFromString(
      minValue,
    );
    const maxDate: Date | null | undefined = HvDateField.createDateFromString(
      maxValue,
    );

    // On iOS, the "default" mode renders a system-styled field that needs
    // to be tapped again in order to unveil the picker. We default it to spinner
    // so that the picking experience is available immediately.
    const displayMode: 'spinner' | 'default' =
      this.props.element.getAttribute('mode') || Platform.OS === 'ios'
        ? 'spinner'
        : 'default';
    const locale: DOMString | undefined =
      this.props.element.getAttribute('locale') ?? undefined;

    return (
      <DateTimePicker
        display={displayMode}
        locale={locale}
        maximumDate={maxDate || undefined}
        minimumDate={minDate || undefined}
        mode="date"
        onChange={props.onChange}
        value={this.getPickerValue() || new Date()}
      />
    );
  };

  Content = () => {
    if (!this.isFocused()) {
      return null;
    }

    const { Picker } = this;

    /**
     * On iOS this component is rendered inline, and on Android it's rendered as a modal.
     * Thus, on iOS we need to wrap this component in our own modal for consistency.
     */
    if (Platform.OS === 'ios') {
      return (
        <Modal
          element={this.props.element}
          isFocused={this.isFocused}
          onModalCancel={this.onCancel}
          onModalDone={this.onDone}
          onUpdate={this.props.onUpdate as HvComponentOnUpdate}
          options={this.props.options}
          stylesheets={this.props.stylesheets}
        >
          <Picker
            onChange={(evt: DateTimePickerEvent, date?: Date) =>
              this.setPickerValue(date)
            }
          />
        </Modal>
      );
    }
    const onChange = (evt: DateTimePickerEvent, date?: Date) => {
      if (date === undefined) {
        this.onCancel();
      } else {
        this.onDone(date);
      }
    };
    return <Picker onChange={onChange} />;
  };

  /**
   * Renders the field (view and text label).
   * Pressing the field will focus it and:
   * - on iOS, bring up a bottom sheet with date picker
   * - on Android, show the system date picker
   */
  render() {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }

    const { Content } = this;

    return (
      <Field
        element={this.props.element}
        focused={this.isFocused()}
        onPress={this.onFieldPress}
        options={this.props.options}
        stylesheets={this.props.stylesheets}
        value={this.getValue()}
      >
        <Content />
      </Field>
    );
  }
}
