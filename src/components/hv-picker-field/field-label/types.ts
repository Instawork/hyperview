import type { DOMString, StyleSheet } from 'hyperview/src/types';

export type Props = {
  focused: boolean;
  labelFormat: string | null | undefined;
  placeholder: string | null | undefined;
  placeholderTextColor: string | null | undefined;
  pressed: boolean;
  style: StyleSheet;
  value: DOMString | null | undefined;
};
