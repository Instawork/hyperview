import * as NavigatorService from 'hyperview/src/services/navigator';
import type {
  HvComponentOnUpdate,
  NavigationProvider,
  OnUpdateCallbacks,
  ScreenState,
} from 'hyperview/src/types';
import { Props as HvRootProps } from 'hyperview/src/core/components/hv-root/types';

/**
 * All of the props used by hv-screen
 */
export type Props = Omit<
  HvRootProps,
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
  route?: NavigatorService.Route<string, { url?: string }>;
  url?: string;
  getLocalDoc: () => Document | null;
  getScreenState: () => ScreenState;
  setScreenState: (state: ScreenState) => void;
};
