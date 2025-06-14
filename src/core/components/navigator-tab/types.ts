import * as React from 'react';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

export type Props = {
  id: string;
  backBehavior: 'none' | 'initialRoute' | 'history' | 'order';
  initialRouteName: string;
  children: React.ReactNode;
  screenOptions: BottomTabNavigationOptions;
  tabBar?: ((props: BottomTabBarProps) => React.ReactNode) | undefined;
};
