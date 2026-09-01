import type * as NavigatorService from 'hyperview/src/services/navigator';
import * as React from 'react';
import type {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  NativeStackView,
} from '@react-navigation/native-stack';
import type {
  StackNavigationEventMap,
  StackNavigationOptions,
  StackView,
} from '@react-navigation/stack';
import type { RouterConfigOptions } from '@react-navigation/routers';

export type Props = {
  id: string;
  children?: React.ReactNode;
  initialRouteName?: string;
  screenOptions?: NativeStackNavigationOptions | StackNavigationOptions;
};

export type RouterRenameOptions = RouterConfigOptions & {
  /**
   * List of routes whose key has changed even if they still have the same name.
   * This allows to remove screens declaratively.
   */
  routeKeyChanges: string[];
};

export type StackOptions = {
  entrypointUrl: string | undefined;
  getDoc?: () => Document | undefined;
  id: string;
  initialRouteName?: string;
};

export type NavigationEventMap = NativeStackNavigationEventMap &
  StackNavigationEventMap;
export type NavigationOptions = NativeStackNavigationOptions &
  StackNavigationOptions;

export type CompatibleNativeStackViewProps = Omit<
  React.ComponentProps<typeof NativeStackView>,
  'describe'
> & {
  describe?: unknown;
};

export type CompatibleStackViewProps = Omit<
  React.ComponentProps<typeof StackView>,
  'describe' | 'direction'
> & {
  describe?: unknown;
  direction?: NavigatorService.Locale['direction'];
};

export type NavigationBuilderWithDescribe = {
  describe?: unknown;
};

/**
 * Component types for stack views with compatible React Navigation props
 */
export type NativeViewComponent = React.ComponentType<CompatibleNativeStackViewProps>;
export type StackViewComponent = React.ComponentType<CompatibleStackViewProps>;
