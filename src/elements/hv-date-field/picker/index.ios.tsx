import DateTimePicker from 'hyperview/src/components/date-time-picker';
import Modal from 'hyperview/src/components/modal';
import type { Props } from './types';
import React from 'react';
import styles from './styles';

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
      focused={props.focused}
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
        // Force a max date - this is a workaround for a bug in the DateTimePicker
        // where selection is not possible after a picker was rendered with a max date
        // unless the max date is actually set to a value.
        maximumDate={props.maxDate || new Date('2100-01-01T00:00:00.000Z')}
        minimumDate={props.minDate || undefined}
        mode="date"
        onChange={(evt: unknown, date?: Date) => props.setPickerValue(date)}
        style={styles.container}
        value={props.value}
      />
    </Modal>
  );
};
