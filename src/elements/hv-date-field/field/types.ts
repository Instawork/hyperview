import type { HvComponentOptions, StyleSheets } from 'hyperview/src/types';
import { ReactNode } from 'react';

export type Props = {
  children?: ReactNode;
  element: Element;
  focused: boolean;
  onPress: () => void;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
  value: Date | null | undefined;
};
