import * as Components from 'hyperview/src/services/components';
import * as NavigatorService from 'hyperview/src/services/navigator';
import {
  HvComponentOnUpdate,
  NavigationProps,
  OnUpdateCallbacks,
  RouteProps,
  ScreenState,
} from 'hyperview/src/types';
import { ComponentType } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = {
  url?: string;
  navigator: NavigatorService.Navigator;
  route?: RouteProps;
  entrypointUrl: string;
  onUpdate: HvComponentOnUpdate;
  elementErrorComponent?: ComponentType<ErrorProps>;
  getElement: (key: number) => Element | undefined;
  removeElement: (key: number) => void;
  componentRegistry: Components.Registry;
  element?: Element;
  doc: Document | undefined;
  getDoc: () => Document | undefined;
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
  route?: RouteProps;
};
