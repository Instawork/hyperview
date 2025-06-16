import * as NavigatorService from 'hyperview/src/services/navigator';
import {
  HvBehavior,
  HvComponent,
  HvComponentOnUpdate,
  NavigationProps,
  OnUpdateCallbacks,
  RouteParams,
  ScreenState,
} from 'hyperview/src/types';
import { ComponentType } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Route as NavigatorRoute } from '@react-navigation/native';

/**
 * The route prop used by react-navigation
 */
export type RouteProps = NavigatorRoute<string, { url?: string }>;

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = {
  url?: string;
  navigator: NavigatorService.Navigator;
  route?: NavigatorRoute<string, RouteParams>;
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
  navigation?: NavigationProps;
  route?: NavigatorRoute<string, RouteParams>;
};
