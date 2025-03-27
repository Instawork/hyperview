import * as NavigatorService from 'hyperview/src/services/navigator';
import type {
  HvComponentOnUpdate,
  NavigationProvider,
  Reload,
  ScreenState,
} from 'hyperview/src/types';
import { Props as HvRootProps } from 'hyperview/src/core/components/hv-root/types';

/**
 * All of the props used by hv-screen
 */
export type Props = Omit<
  HvRootProps,
  | 'refreshControl'
  | 'navigationComponents'
  | 'onRouteBlur'
  | 'onRouteFocus'
  | 'loadingScreen'
  | 'handleBack'
  | 'logger'
> & {
  getElement?: (id: number) => Element | undefined;
  navigation: NavigationProvider;
  onUpdate: HvComponentOnUpdate;
  reload: Reload;
  removeElement?: (id: number) => void;
  route?: NavigatorService.Route<string, { url?: string }>;
  url?: string;
  getLocalDoc: () => Document | null;
  getScreenState: () => ScreenState;
  setLocalDoc: (doc: Document | null) => void;
  setScreenState: (state: ScreenState) => void;
  loadUrl: (url?: string) => void;
};
