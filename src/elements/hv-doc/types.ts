import {
  HvComponentOnUpdate,
  NavigationProvider,
  OnUpdateCallbacks,
  Route,
  ScreenState,
} from 'hyperview/src/types';

export type Props = {
  children?: React.ReactNode;
  element?: Element;
  navigationProvider: NavigationProvider;
  route?: Route;
  url: string;
};

export type StateContextProps = {
  getLocalDoc: () => Document | null;
  getScreenState: () => ScreenState;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  setScreenState: (state: ScreenState) => void;
};

export type ErrorProps = {
  error: Error | null | undefined;
  navigationProvider?: NavigationProvider;
  url: string | null | undefined;
};

export type DocState = ScreenState & {
  loadingUrl?: string | null | undefined;
};
