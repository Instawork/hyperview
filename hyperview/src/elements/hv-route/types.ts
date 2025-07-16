import * as Components from 'hyperview/src/services/components';
import {
  HvComponentOnUpdate,
  NavigationProps,
  OnUpdateCallbacks,
  RouteProps,
  ScreenState,
} from 'hyperview/src/types';
import { ComponentType } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/components/load-error';

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = {
  componentRegistry: Components.Registry;
  element?: Element;
  elementErrorComponent?: ComponentType<ErrorProps>;
  getDoc: () => Document | undefined;
  getScreenState: () => ScreenState;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  route?: RouteProps;
  setScreenState: (state: ScreenState) => void;
  url?: string;
};

/**
 * All of the props used by hv-route
 */
export type Props = {
  navigation?: NavigationProps;
  route?: RouteProps;
};
