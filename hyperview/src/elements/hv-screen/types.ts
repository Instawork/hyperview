import * as Components from 'hyperview/src/services/components';
import type {
  ElementErrorComponentProps,
  HvComponentOnUpdate,
  OnUpdateCallbacks,
  ScreenState,
} from 'hyperview/src/types';
import type {
  NavigationProp,
  NavigationState,
  ParamListBase,
} from '@react-navigation/native';
import type { ComponentType } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/**
 * All of the props used by hv-screen
 */
export type Props = {
  componentRegistry: Components.Registry;
  elementErrorComponent?: ComponentType<ElementErrorComponentProps>;
  getScreenState: () => ScreenState;
  onUpdate: HvComponentOnUpdate;
  onUpdateCallbacks: OnUpdateCallbacks;
  reload: (url?: string | null) => void;
  setScreenState: (state: ScreenState) => void;
};

type NativeHeaderOptionName =
  | 'headerBackVisible'
  | 'headerBlurEffect'
  | 'headerLargeTitleEnabled'
  | 'headerLargeTitleStyle'
  | 'headerShadowVisible'
  | 'headerShown'
  | 'headerTitleStyle'
  | 'headerTransparent'
  | 'title'
  | 'unstable_headerLeftItems'
  | 'unstable_headerRightItems';

export type NativeHeaderOptions = Pick<
  NativeStackNavigationOptions,
  NativeHeaderOptionName
>;

export type NativeHeaderNavigation = NavigationProp<
  ParamListBase,
  string,
  string | undefined,
  NavigationState<ParamListBase>,
  NativeHeaderOptions
>;

export type NativeHeaderInitializerProps = {
  onInitialized: () => void;
  options: NativeHeaderOptions;
};
