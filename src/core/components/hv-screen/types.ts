import type { HvComponentOnUpdate, Reload } from 'hyperview/src/types';
import { ComponentType } from 'react';
import { Props as HvRootProps } from 'hyperview/src/core/components/hv-root/types';
import { Props as LoadingProps } from 'hyperview/src/core/components/loading';

/**
 * All of the props used by hv-screen
 */
export type Props = Omit<HvRootProps, 'loadingScreen'> & {
  getLoadingScreen: (id?: string) => ComponentType<LoadingProps>;
  onUpdate: HvComponentOnUpdate;
  registerPreload?: (id: number, element: Element) => void;
  reload: Reload;
};
