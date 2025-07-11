import * as NavigatorService from 'hyperview/src/services/navigator';
import {
  ExperimentalFeatures,
  Fetch,
  HvBehavior,
  HvComponent,
  HvComponentOnUpdate,
  OnUpdateCallbacks,
  Reload,
  Route,
  RouteParams,
  ScreenState,
} from 'hyperview/src/types';
import { ComponentType } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';

export type NavigationContextProps = {
  entrypointUrl: string;
  fetch: Fetch;
  onError?: (error: Error) => void;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  onRouteBlur?: (route: Route) => void;
  onRouteFocus?: (route: Route) => void;
  onUpdate: HvComponentOnUpdate;
  url?: string;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  reload: Reload;
  experimentalFeatures?: ExperimentalFeatures;
};

/**
 * The route prop used by react-navigation
 */
export type RouteProps = NavigatorService.Route<string, { url?: string }>;

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = {
  url?: string;
  navigator: NavigatorService.Navigator;
  route?: NavigatorService.Route<string, RouteParams>;
  entrypointUrl: string;
  onUpdate: HvComponentOnUpdate;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  getElement: (key: number) => Element | undefined;
  removeElement: (key: number) => void;
  element?: Element;
  doc: Document | undefined;
  getLocalDoc: () => Document | null;
  setScreenState: (state: ScreenState) => void;
  getScreenState: () => ScreenState;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
};

/**
 * All of the props used by hv-route
 */
export type Props = {
  navigation?: NavigatorService.NavigationProp;
  route?: NavigatorService.Route<string, RouteParams>;
};
