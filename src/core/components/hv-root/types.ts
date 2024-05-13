import * as NavigatorService from 'hyperview/src/services/navigator';
import { ComponentType, ReactNode } from 'react';
import type {
  Fetch,
  HvBehavior,
  HvComponent,
  Log,
  NavigationRouteParams,
  Route,
} from 'hyperview/src/types';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';
import type { RefreshControlProps } from 'react-native';

/**
 * All of the props used by hv-screen
 */
export type Props = {
  formatDate: (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined;
  refreshControl?: ComponentType<RefreshControlProps>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: any;
  route?: NavigatorService.Route<string, { url?: string }>;
  entrypointUrl: string;
  fetch: Fetch;
  onError?: (error: Error) => void;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  onRouteBlur?: (route: Route) => void;
  onRouteFocus?: (route: Route) => void;
  url?: string;
  back?: (params: NavigationRouteParams | object | undefined) => void;
  closeModal?: (params: NavigationRouteParams | object | undefined) => void;
  navigate?: (params: NavigationRouteParams | object, key: string) => void;
  openModal?: (params: NavigationRouteParams | object) => void;
  push?: (params: object) => void;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
  doc?: Document;
  registerPreload?: (id: number, element: Element) => void;
  log?: Log;
};
