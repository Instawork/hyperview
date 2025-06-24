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

export type Props = HyperviewProps & {
  onUpdate: HvComponentOnUpdate;
  reload: Reload;
};
