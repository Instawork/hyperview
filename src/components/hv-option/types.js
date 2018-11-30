// @flow

import type { Animations, Element, HvComponentOnUpdate, HvComponentOptions, StyleSheets } from 'hyperview/src/types';

export type Props = {|
  animations: ?Animations,
  element: Element,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};

export type State = {|
  pressed: boolean,
|};
