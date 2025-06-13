import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';

export type Props = {
  element: Element;
  focused: boolean;
  locale: string | undefined;
  maxDate: Date | null;
  minDate: Date | null;
  onCancel: () => void;
  onDone: (date?: Date) => void;
  onUpdate: HvComponentOnUpdate;
  options: HvComponentOptions;
  setPickerValue: (date?: Date) => void;
  stylesheets: StyleSheets;
  value: Date;
};

export type DisplayMode = 'spinner' | 'default';
