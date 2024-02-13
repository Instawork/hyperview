import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import type { ReactNode } from 'react';

export type Props = {
  children: ReactNode;
  element: Element;
  isFocused: () => boolean;
  onModalCancel: () => void;
  onModalDone: () => void;
  onUpdate: HvComponentOnUpdate;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
};
