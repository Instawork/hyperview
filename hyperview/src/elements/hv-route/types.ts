import * as Components from 'hyperview/src/services/components';
import type { ComponentType, ReactNode } from 'react';
import type {
  ElementErrorComponentProps,
  HvComponentOnUpdate,
  NavigationProps,
  OnUpdateCallbacks,
  RouteProps,
  ScreenState,
} from 'hyperview/src/types';
import type { usePreventRemove } from '@react-navigation/native';

export type PreventRemoveEvent = Parameters<
  Parameters<typeof usePreventRemove>[1]
>[0];

export type PreventRemoveAction = PreventRemoveEvent['data']['action'];

export type RouteGuardProps = {
  children: ReactNode;
  navigation: NavigationProps;
  onBlur: () => void;
  onFocus: () => void;
  onRemove: () => void;
  preventRemove: boolean;
  resumeRemoval: (action: PreventRemoveAction) => void;
  runBackBehaviors: () => void;
};

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = {
  componentRegistry: Components.Registry;
  element?: Element;
  elementErrorComponent?: ComponentType<ElementErrorComponentProps>;
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
