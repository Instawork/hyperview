import type { DisplayMode, Props } from './types';
import DateTimePicker from 'hyperview/src/core/components/date-time-picker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';

export default (props: Props): JSX.Element | null => {
  if (!props.focused) {
    return null;
  }

  return (
    <DateTimePicker
      display={(props.element.getAttribute('mode') as DisplayMode) || 'default'}
      locale={props.locale}
      maximumDate={props.maxDate || undefined}
      minimumDate={props.minDate || undefined}
      mode="date"
      onChange={(evt: DateTimePickerEvent, date?: Date) => {
        // Covers press on "cancel" and Hardware back button on Android
        if (evt.type === 'dismissed') {
          props.onCancel();
        } else {
          props.onDone(date);
        }
      }}
      value={props.value}
    />
  );
};
