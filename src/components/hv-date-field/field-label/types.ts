import type { StyleSheet } from 'hyperview/src/types';

export type Props = {
  focused: boolean;
  formatter: (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined;
  labelFormat: string | null | undefined;
  placeholder: string | null | undefined;
  placeholderTextColor: string | null | undefined;
  pressed: boolean;
  style: StyleSheet;
  value: Date | null | undefined;
};
