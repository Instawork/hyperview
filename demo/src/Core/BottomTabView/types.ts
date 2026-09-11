import type {
  BottomTabBarProps,
  BottomTabView,
} from '@react-navigation/bottom-tabs';
import type {
  TabSelectedEvent,
  TabsScreenPropsIOS,
} from 'react-native-screens';
import type { ComponentProps } from 'react';

export type Props = BottomTabBarProps & {
  id: string;
};

export type BottomTabViewProps = ComponentProps<typeof BottomTabView>;

export type NativeTabBarItem = {
  badgeValue?: string;
  icon?: TabsScreenPropsIOS['icon'];
  label?: string;
  route: string;
};

export type NativeTabBarItems = NativeTabBarItem[];

export type NativeTabEvent = {
  actionOrigin?: TabSelectedEvent['actionOrigin'];
  provenance: TabSelectedEvent['provenance'];
  selectedScreenKey: TabSelectedEvent['selectedScreenKey'];
};
