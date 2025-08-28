import * as Components from 'hyperview/src/services/components';
import type {
  HvComponentOnUpdate,
  OnUpdateCallbacks,
  ScreenState,
} from 'hyperview/src/types';
import { ComponentType } from 'react';
import type { Props as ElementErrorProps } from 'hyperview/src/components/load-element-error';
import type { Props as ErrorProps } from 'hyperview/src/components/load-error';

/**
 * All of the props used by hv-screen
 */
export type Props = {
  componentRegistry: Components.Registry;
  /**
   * @deprecated Components typed with ErrorProps are temporarily accepted;
   * migrate to ElementErrorProps.
   */
  elementErrorComponent?:
    | ComponentType<ElementErrorProps>
    | ComponentType<ErrorProps>;
  getScreenState: () => ScreenState;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  setScreenState: (state: ScreenState) => void;
};
