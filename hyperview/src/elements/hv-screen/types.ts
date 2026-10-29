import * as Components from 'hyperview/src/services/components';
import type {
  ElementErrorComponentProps,
  HvComponentOnUpdate,
  OnUpdateCallbacks,
  ScreenState,
} from 'hyperview/src/types';
import type { ComponentType } from 'react';

/**
 * All of the props used by hv-screen
 */
export type Props = {
  componentRegistry: Components.Registry;
  elementErrorComponent?: ComponentType<ElementErrorComponentProps>;
  getScreenState: () => ScreenState;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  setScreenState: (state: ScreenState) => void;
};
