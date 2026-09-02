import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BottomTabView } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';

export type Props = BottomTabBarProps & {
  id: string;
};

export type TabViewProps = ComponentProps<typeof BottomTabView>;

export type NativeTabConfirmedState = {
  provenance: number;
  routeKey: string;
};

export type NativeTabState = {
  confirmed: NativeTabConfirmedState;
};

export type NativeTabAction = {
  confirmed: NativeTabConfirmedState;
  type: 'CONFIRM_STATE';
};

export type TabBarRouteItem = {
  badgeValue?: string;
  iconSource: ImageSourcePropType | null;
  label: string;
};

export type TabBarItemPresentation = {
  badgeValue?: string;
  iconHref?: string;
  label: string;
  route: string | null;
};

export type NavigationWithOptions = Props['navigation'] & {
  setOptions?: (options: { tabBarStyle: StyleProp<ViewStyle> }) => void;
};
