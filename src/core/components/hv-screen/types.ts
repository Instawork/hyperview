import * as NavigatorService from 'hyperview/src/services/navigator';
import type {
  HvComponentOnUpdate,
  NavigationRouteParams,
  Reload,
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
  back?: (params: NavigationRouteParams | object | undefined) => void;
  closeModal?: (params: NavigationRouteParams | object | undefined) => void;
  doc?: Document;
  getElement?: (id: number) => Element | undefined;
  navigate?: (params: NavigationRouteParams | object, key: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: any;
  onUpdate: HvComponentOnUpdate;
  openModal?: (params: NavigationRouteParams | object) => void;
  push?: (params: object) => void;
  setElement?: (id: number, element: Element) => void;
  reload: Reload;
  removeElement?: (id: number) => void;
  route?: NavigatorService.Route<string, { url?: string }>;
  url?: string;
};
