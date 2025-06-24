import * as Contexts from 'hyperview/src/contexts';
import * as React from 'react';
import { Props as HyperviewProps } from 'hyperview/src/types';
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
  hyperview: HyperviewProps | null;
  docContextProps: Contexts.DocContextProps | null;
  id: string;
  initialRouteName?: string;
};
