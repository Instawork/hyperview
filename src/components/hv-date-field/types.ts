import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export type PickerProps = {
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
};
