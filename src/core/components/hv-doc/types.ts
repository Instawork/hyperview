import { ScreenState } from 'hyperview/src/types';

export type Props = {
  children?: React.ReactNode;
  element?: Element;
};

export type StateContextProps = {
  getLocalDoc: () => Document | null;
  getScreenState: () => ScreenState;
  setLocalDoc: (doc: Document | null) => void;
  setScreenState: (state: ScreenState) => void;
};
