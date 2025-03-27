import type { HvComponentOptions, StyleSheets } from 'hyperview/src/types';

export type Props = {
  element: Element;
  label: string;
  onPress: () => void;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
};
