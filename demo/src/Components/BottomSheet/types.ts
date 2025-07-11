import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheet,
  StyleSheets,
} from 'hyperview';
import type { ReactNode } from 'react';

export type HvProps = {
  animationDuration: number;
  dismissible: boolean;
  toggleEventName: string | null;
  visible: boolean;
};

export type Props = {
  children: ReactNode;
  element: Element;
  focused: boolean;
  onModalCancel: () => void;
  onModalDone: () => void;
  onUpdate: HvComponentOnUpdate;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
};

export type OverlayProps = {
  onPress: () => void;
  style: StyleSheet;
};
