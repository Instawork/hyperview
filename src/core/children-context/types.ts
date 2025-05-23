import { HvComponentProps } from 'hyperview/src/types';
import { ReactNode } from 'react';

export type ChildrenContextProviderProps = HvComponentProps & {
  children: ReactNode;
  // Optionally pass in a list of child nodes to render,
  // otherwise use the child nodes from the element
  childNodes?: ChildNode[];
};

export type ChildrenContextProps = {
  childList: Array<React.ReactElement<HvComponentProps> | null | string>;
};
