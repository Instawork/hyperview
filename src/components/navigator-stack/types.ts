import type * as NavigatorService from 'hyperview/src/services/navigator';
import * as React from 'react';
import type {
  StackNavigationOptions,
  StackView,
} from '@react-navigation/stack';
import type { RouterConfigOptions } from '@react-navigation/routers';

export type Props = {
  id: string;
  children?: React.ReactNode;
  initialRouteName?: string;
  screenOptions?: StackNavigationOptions;
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
