/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  PressTrigger,
  StyleSheets,
} from 'hyperview/src/types';
import { TRIGGERS } from 'hyperview/src/types';

export type Props = {
  element: Element,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  stylesheets: StyleSheets
};

export type State = {
  pressed: boolean,
  refreshing: boolean
};

export const ATTRIBUTES = {
  ACTION: 'action',
  DELAY: 'delay',
  HIDE_DURING_LOAD: 'hide-during-load',
  HREF: 'href',
  HREF_STYLE: 'href-style',
  IMMEDIATE: 'immediate',
  ONCE: 'once',
  SHOW_DURING_LOAD: 'show-during-load',
  TARGET: 'target',
  TRIGGER: 'trigger',
  VERB: 'verb',
} as const;

export type Attribute = typeof ATTRIBUTES[keyof typeof ATTRIBUTES];

export type PressHandlers = {
  onLongPress?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onPress?: () => void
};

export const PRESS_PROP_NAMES = {
  ON_LONG_PRESS: 'onLongPress',
  ON_PRESS: 'onPress',
  ON_PRESS_IN: 'onPressIn',
  ON_PRESS_OUT: 'onPressOut',
} as const;

export type PressPropName = typeof PRESS_PROP_NAMES[keyof typeof PRESS_PROP_NAMES];

export const PRESS_TRIGGERS_PROP_NAMES: Partial<Record<PressTrigger, PressPropName>> = {
  [TRIGGERS.LONG_PRESS]: PRESS_PROP_NAMES.ON_LONG_PRESS,
  [TRIGGERS.PRESS_IN]: PRESS_PROP_NAMES.ON_PRESS_IN,
  [TRIGGERS.PRESS_OUT]: PRESS_PROP_NAMES.ON_PRESS_OUT,
  [TRIGGERS.PRESS]: PRESS_PROP_NAMES.ON_PRESS,
};
