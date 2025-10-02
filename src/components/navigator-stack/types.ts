import * as React from 'react';
import type { RouterConfigOptions } from '@react-navigation/native';
import type { StackNavigationOptions } from '@react-navigation/stack';

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
