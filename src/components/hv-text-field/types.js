// @flow

import type { Animations, Element, HvComponentOptions, StyleSheets } from 'hyperview';

export type Props = {|
  animations: Animations,
  element: Element,
  onUpdate: () => void,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};

export type State = {|
  focused: boolean,
  value: string,
|};
