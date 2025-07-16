import type { StyleSheet } from 'hyperview/src/types';

export type Props = {
  element: Element;
  focused: boolean;
  formatter: (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined;
  pressed: boolean;
  style: StyleSheet;
  value: Date | null | undefined;
};
