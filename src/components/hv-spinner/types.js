// @flow

import type { Animations, DOMString, Element, HvComponentOptions, StyleSheets } from 'hyperview';

export type Props = {|
  animations: Animations,
  element: Element,
  onUpdate: (
    path: DOMString,
    action: DOMString,
    element: Element,
    options: HvComponentOptions,
  ) => void,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};
