import type { HvComponentOnUpdate } from 'hyperview/src/types';

export type Props = {
  add: (elements: Element[], onUpdate: HvComponentOnUpdate) => void;
  get: () => Element[];
  onUpdate: HvComponentOnUpdate;
  remove: (elements: Element[]) => void;
};
