import type { BehaviorRegistry, HvBehavior } from 'hyperview/src/types';
import HvAlert from 'hyperview/src/behaviors/hv-alert';
import HvCopyToClipboard from 'hyperview/src/behaviors/hv-copy-to-clipboard';
import HvHide from 'hyperview/src/behaviors/hv-hide';
import HvOpenSettings from 'hyperview/src/behaviors/hv-open-settings';
import HvSelectAll from 'hyperview/src/behaviors/hv-select-all';
import HvSetValue from 'hyperview/src/behaviors/hv-set-value';
import HvShow from 'hyperview/src/behaviors/hv-show';
import HvToggle from 'hyperview/src/behaviors/hv-toggle';
import HvUnselectAll from 'hyperview/src/behaviors/hv-unselect-all';

const HYPERVIEW_BEHAVIORS = [
  HvAlert,
  HvCopyToClipboard,
  HvHide,
  HvOpenSettings,
  HvSelectAll,
  HvSetValue,
  HvShow,
  HvToggle,
  HvUnselectAll,
];

export const getRegistry = (behaviors: HvBehavior[] = []): BehaviorRegistry =>
  [...HYPERVIEW_BEHAVIORS, ...behaviors].reduce(
    (registry: BehaviorRegistry, behavior: HvBehavior) => ({
      ...registry,
      [behavior.action]: behavior,
    }),
    {},
  );

export {
  setIndicatorsBeforeLoad,
  performUpdate,
  setIndicatorsAfterLoad,
  isOncePreviouslyApplied,
  setRanOnce,
} from 'hyperview/src/services/behaviors';
