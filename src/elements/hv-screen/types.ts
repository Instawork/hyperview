import * as Components from 'hyperview/src/services/components';
import type {
  HvComponentOnUpdate,
  OnUpdateCallbacks,
  ScreenState,
} from 'hyperview/src/types';
import { ComponentType } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/components/load-error';

/**
 * All of the props used by hv-screen
 */
export type Props = {
  componentRegistry: Components.Registry;
  elementErrorComponent?: ComponentType<ErrorProps>;
  getScreenState: () => ScreenState;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  setScreenState: (state: ScreenState) => void;
};
