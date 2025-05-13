import * as NavigatorService from 'hyperview/src/services/navigator';
import {
  DOMString,
  HvComponentOnUpdate,
  NavigationProvider,
  OnUpdateCallbacks,
  ScreenState,
} from 'hyperview/src/types';

export type Props = {
  children?: React.ReactNode;
  doc?: Document;
  element?: Element;
  navigationProvider: NavigationProvider;
  route?: NavigatorService.Route<
    string,
    {
      behaviorElementId?: number;
      delay?: DOMString | number | null;
      needsSubStack?: boolean;
      preloadScreen?: number;
      url?: string | null;
    }
  >;
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
