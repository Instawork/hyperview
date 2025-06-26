import * as Components from 'hyperview/src/services/components';
import {
  DOMString,
  HvComponentOnUpdate,
  HvComponentOptions,
  Props as HyperviewProps,
} from 'hyperview/src/types';

type Reload = (
  optHref: DOMString | null | undefined,
  opts: HvComponentOptions,
) => void;

export type Props = Omit<HyperviewProps, 'behaviors' | 'components'> & {
  componentRegistry: Components.Registry;
  onUpdate: HvComponentOnUpdate;
  reload: Reload;
};
