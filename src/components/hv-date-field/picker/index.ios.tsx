import DateTimePicker from 'hyperview/src/core/components/date-time-picker';
import Modal from 'hyperview/src/core/components/modal';
import type { Props } from './types';
import React from 'react';

/**
 * On iOS this component is rendered inline, and on Android it's rendered as a modal.
 * Thus, on iOS we need to wrap this component in our own modal for consistency.
 */
export default (props: Props): JSX.Element | null => {
  if (!props.focused) {
    return null;
  }

  return (
    <Modal
      element={props.element}
      isFocused={() => props.focused}
      onModalCancel={props.onCancel}
      onModalDone={props.onDone}
      onUpdate={props.onUpdate}
      options={props.options}
      stylesheets={props.stylesheets}
    >
      <DateTimePicker
        // On iOS, the "default" mode renders a system-styled field that needs
        // to be tapped again in order to unveil the picker. We default it to spinner
        // so that the picking experience is available immediately.
        display="spinner"
        locale={props.locale}
        maximumDate={props.maxDate || undefined}
        minimumDate={props.minDate || undefined}
        mode="date"
        onChange={(evt: unknown, date?: Date) => props.setPickerValue(date)}
        value={props.value}
      />
    </Modal>
  );
};
