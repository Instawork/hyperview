import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview';
import type { ReactNode } from 'react';
import type { StyleSheet } from 'hyperview/src/types';

export type HvProps = {
  animationDuration: number;
  dismissible: boolean;
  toggleEventName: string | null;
  visible: boolean;
};

export type LayoutEvent = {
  nativeEvent: {
    layout: {
      height: number;
    };
  };
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
