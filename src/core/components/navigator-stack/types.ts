import * as Contexts from 'hyperview/src/contexts';
import * as React from 'react';
import { NavigationContextProps } from 'hyperview/src/contexts/navigation';
import { RouterConfigOptions } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';

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
  docContextProps: Contexts.DocContextProps | null;
  id: string;
  initialRouteName?: string;
  navContextProps: NavigationContextProps | null;
};
