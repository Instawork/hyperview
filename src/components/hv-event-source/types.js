// @flow

import type {
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';

export type Props = {|
  element: Element,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};
