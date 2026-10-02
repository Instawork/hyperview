import * as React from 'react';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import type { TabRouterOptions } from '@react-navigation/native';

export type Props = {
  id: string;
  backBehavior: 'none' | 'initialRoute' | 'history' | 'order';
  initialRouteName: string;
  children: React.ReactNode;
  screenOptions: BottomTabNavigationOptions;
  tabBar?: ((props: BottomTabBarProps) => React.ReactNode) | undefined;
};

export type TabOptions = TabRouterOptions & {
  getDoc?: () => Document | undefined;
  id: string;
};
