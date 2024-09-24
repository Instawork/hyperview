import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { HvComponentProps, LocalName } from 'hyperview/src/types';
import { createDateFromString, createStringFromDate } from './helpers';
import Field from './field';
import { LOCAL_NAME } from 'hyperview/src/types';
import Picker from './picker';
import React from 'react';
import { getNameValueFormInputValues } from 'hyperview/src/services';

/**
 * A date field renders a form field with ISO date fields (YYYY-MM-DD).
 * Focusing the field brings up a system-appropriate UI for date selection:
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android and web, pressing the field brings up the system date picker modal.
 */
const HvDateField = (props: HvComponentProps): JSX.Element | null => {
  /**
   * Shows the picker, defaulting to the field's value.
   * If the field is not set, use today's date in the picker.
   */
  const onFieldPress = () => {
    const newElement = props.element.cloneNode(true) as Element;
    const value: string =
      props.element.getAttribute('value') || createStringFromDate(new Date());

    // Focus the field and populate the picker with the field's value.
    newElement.setAttribute('focused', 'true');
    newElement.setAttribute('picker-value', value);
    props.onUpdate(null, 'swap', props.element, { newElement });
    Behaviors.trigger('focus', newElement, props.onUpdate);
  };

  /**
   * Hides the picker without applying the chosen value.
   */
  const onCancel = () => {
    const newElement = props.element.cloneNode(true) as Element;
    newElement.setAttribute('focused', 'false');
    newElement.removeAttribute('picker-value');
    props.onUpdate(null, 'swap', props.element, { newElement });
    Behaviors.trigger('blur', newElement, props.onUpdate);
  };

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  const onDone = (newValue?: Date) => {
    const pickerValue =
      newValue !== undefined
        ? newValue
        : createDateFromString(props.element.getAttribute('picker-value'));
    const value = createStringFromDate(pickerValue);
    const hasChanged = props.element.getAttribute('value') !== value;
    const newElement = props.element.cloneNode(true) as Element;
    newElement.setAttribute('value', value);
    newElement.removeAttribute('picker-value');
    newElement.setAttribute('focused', 'false');
    props.onUpdate(null, 'swap', props.element, { newElement });
    if (hasChanged) {
      Behaviors.trigger('change', newElement, props.onUpdate);
    }
    Behaviors.trigger('blur', newElement, props.onUpdate);
  };

  /**
   * Updates the picker value while keeping the picker open.
   */
  const setPickerValue = (value: Date | null | undefined) => {
    const formattedValue: string = createStringFromDate(value);
    const newElement = props.element.cloneNode(true) as Element;
    newElement.setAttribute('picker-value', formattedValue);
    props.onUpdate(null, 'swap', props.element, { newElement });
  };

  /**
   * Renders the field (view and text label).
   * Pressing the field will focus it and:
   * - on iOS, bring up a bottom sheet with date picker
   * - on Android, show the system date picker
   */
  if (props.element.getAttribute('hide') === 'true') {
    return null;
  }

  const focused = props.element.getAttribute('focused') === 'true';
  const locale = props.element.getAttribute('locale') ?? undefined;
  const minDate = createDateFromString(props.element.getAttribute('min'));
  const maxDate = createDateFromString(props.element.getAttribute('max'));
  const value =
    createDateFromString(props.element.getAttribute('picker-value')) ||
    new Date();

  return (
    <Field
      element={props.element}
      focused={focused}
      onPress={onFieldPress}
      options={props.options}
      stylesheets={props.stylesheets}
      value={createDateFromString(props.element.getAttribute('value'))}
    >
      <Picker
        element={props.element}
        focused={focused}
        locale={locale}
        maxDate={maxDate}
        minDate={minDate}
        onCancel={onCancel}
        onDone={onDone}
        onUpdate={props.onUpdate}
        options={props.options}
        setPickerValue={setPickerValue}
        stylesheets={props.stylesheets}
        value={value}
      />
    </Field>
  );
};

HvDateField.namespaceURI = Namespaces.HYPERVIEW;

HvDateField.localName = LOCAL_NAME.DATE_FIELD;

HvDateField.localNameAliases = [] as LocalName[];

HvDateField.getFormInputValues = (element: Element): Array<[string, string]> =>
  getNameValueFormInputValues(element);

export default HvDateField;
