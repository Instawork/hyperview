import type { HvComponentOnUpdate, Reload } from 'hyperview/src/types';
import { Props as HvRootProps } from 'hyperview/src/core/components/hv-root/types';

/**
 * All of the props used by hv-screen
 */
export type Props = HvRootProps & {
  onUpdate: HvComponentOnUpdate;
  registerPreload?: (id: number, element: Element) => void;
  reload: Reload;
  removePreload?: (id: number) => void;
};
