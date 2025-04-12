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
      delay?: DOMString | number | null;
      url?: string | null;
    }
  >;
};

export type StateContextProps = {
  getLocalDoc: () => Document | null;
  getScreenState: () => ScreenState;
  loadUrl: (url?: string) => void;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  setNeedsLoadCallback: (callback: () => void) => void;
  setScreenState: (state: ScreenState) => void;
};

export type ErrorProps = {
  error: Error | null | undefined;
  navigationProvider?: NavigationProvider;
  url: string | null | undefined;
};
