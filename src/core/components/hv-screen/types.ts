import type { HvComponentOnUpdate, Reload } from 'hyperview/src/types';
import { Props as HvRootProps } from 'hyperview/src/core/components/hv-root/types';

/**
 * All of the props used by hv-screen
 */
export type Props = HvRootProps & {
  onUpdate: HvComponentOnUpdate;
  reload: Reload;
  setFooter?: (element: React.Component | React.FunctionComponent) => void;
};
