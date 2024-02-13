import type { StyleSheet } from 'hyperview/src/types';

export type Props = {
  getStyle: (pressed: boolean) => Array<StyleSheet>;
  label: string;
  onPress: () => void;
};
