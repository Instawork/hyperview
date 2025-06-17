import type {
  HvComponentOnUpdate,
  NavigationProvider,
  OnUpdateCallbacks,
  RouteProps,
  ScreenState,
} from 'hyperview/src/types';
import { Props as HvProps } from 'hyperview/src/types';

/**
 * All of the props used by hv-screen
 */
export type Props = Omit<
  HvProps,
  | 'formatDate'
  | 'refreshControl'
  | 'navigationComponents'
  | 'onRouteBlur'
  | 'onRouteFocus'
  | 'loadingScreen'
  | 'logger'
  | 'errorScreen'
  | 'fetch'
  | 'onError'
  | 'onParseAfter'
  | 'onParseBefore'
  | 'url'
> & {
  getElement?: (id: number) => Element | undefined;
  navigation: NavigationProvider;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  removeElement?: (id: number) => void;
  route?: RouteProps;
  url?: string;
  getLocalDoc: () => Document | null;
  getScreenState: () => ScreenState;
  setScreenState: (state: ScreenState) => void;
};
