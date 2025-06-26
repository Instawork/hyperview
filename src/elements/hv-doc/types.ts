import {
  HvComponentOnUpdate,
  NavigationProvider,
  OnUpdateCallbacks,
  RouteProps,
  ScreenState,
} from 'hyperview/src/types';

export type Props = {
  children?: React.ReactNode;
  hasElement?: boolean;
  navigationProvider: NavigationProvider;
  route?: RouteProps;
  url: string;
};

export type ContextProps = {
  getDoc: () => Document | undefined;
  getScreenState: () => ScreenState;
  getSourceDoc: () => Document | undefined;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  setDoc: (doc: Document) => void;
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
