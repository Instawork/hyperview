import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  PressTrigger,
  StyleSheets,
} from 'hyperview/src/types';
import { TRIGGERS } from 'hyperview/src/types';

export type Props = {
  element: Element;
  onUpdate: HvComponentOnUpdate;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
};

export type State = {
  pressed: boolean;
  refreshing: boolean;
};

export type PressHandlers = {
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onPress?: () => void;
};

export const PRESS_PROP_NAMES = {
  ON_LONG_PRESS: 'onLongPress',
  ON_PRESS: 'onPress',
  ON_PRESS_IN: 'onPressIn',
  ON_PRESS_OUT: 'onPressOut',
} as const;

export type PressPropName = typeof PRESS_PROP_NAMES[keyof typeof PRESS_PROP_NAMES];

export const PRESS_TRIGGERS_PROP_NAMES: Partial<
  Record<PressTrigger, PressPropName>
> = {
  [TRIGGERS.LONG_PRESS]: PRESS_PROP_NAMES.ON_LONG_PRESS,
  [TRIGGERS.PRESS_IN]: PRESS_PROP_NAMES.ON_PRESS_IN,
  [TRIGGERS.PRESS_OUT]: PRESS_PROP_NAMES.ON_PRESS_OUT,
  [TRIGGERS.PRESS]: PRESS_PROP_NAMES.ON_PRESS,
};
