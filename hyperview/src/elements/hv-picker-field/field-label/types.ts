import type {
  DOMString,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';

export type Props = {
  element: Element;
  focused: boolean;
  options: HvComponentOptions;
  pressed: boolean;
  stylesheets: StyleSheets;
  value: DOMString | null | undefined;
};
