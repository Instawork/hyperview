// @flow

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

export type Props = {|
  element: Element,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};

export type State = {|
  pressed: boolean,
  refreshing: boolean,
|};

export const ATTRIBUTES = {
  ACTION: 'action',
  DELAY: 'delay',
  HIDE_DURING_LOAD: 'hide-during-load',
  HREF: 'href',
  HREF_STYLE: 'href-style',
  ONCE: 'once',
  SHOW_DURING_LOAD: 'show-during-load',
  TARGET: 'target',
  TRIGGER: 'trigger',
  VERB: 'verb',
};

export type Attribute = $Values<typeof ATTRIBUTES>;

export type PressHandlers = {
  onLongPress?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onPress?: () => void,
};

export const PRESS_PROP_NAMES = {
  ON_LONG_PRESS: 'onLongPress',
  ON_PRESS_IN: 'onPressIn',
  ON_PRESS_OUT: 'onPressOut',
  ON_PRESS: 'onPress',
};

export type PressPropName = $Values<typeof PRESS_PROP_NAMES>;

export const PRESS_TRIGGERS_PROP_NAMES: {
  [PressTrigger]: PressPropName,
} = {
  [TRIGGERS.LONG_PRESS]: PRESS_PROP_NAMES.ON_LONG_PRESS,
  [TRIGGERS.PRESS_IN]: PRESS_PROP_NAMES.ON_PRESS_IN,
  [TRIGGERS.PRESS_OUT]: PRESS_PROP_NAMES.ON_PRESS_OUT,
  [TRIGGERS.PRESS]: PRESS_PROP_NAMES.ON_PRESS,
};

export const NAV_ACTIONS = {
  BACK: 'back',
  CLOSE: 'close',
  NAVIGATE: 'navigate',
  NEW: 'new',
  PUSH: 'push',
};

export type NavAction = $Values<typeof NAV_ACTIONS>;

export const UPDATE_ACTIONS = {
  REPLACE: 'replace',
  REPLACE_INNER: 'replace-inner',
  APPEND: 'append',
  PREPEND: 'prepend',
};

export type UpdateAction = $Values<typeof UPDATE_ACTIONS>;
