import { ScreenState } from 'hyperview/src/types';

export type Props = {
  children?: React.ReactNode;
  element?: Element;
};

export type StateContextProps = {
  getLocalDoc: () => Document | null;
  getState: () => ScreenState;
  setLocalDoc: (doc: Document | null) => void;
  setState: (state: ScreenState) => void;
};
