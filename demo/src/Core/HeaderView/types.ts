import type {
  NativeStackHeaderItemButton,
  NativeStackHeaderItemMenuAction,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type {
  SearchBarCommands,
  SearchBarPlacement,
} from 'react-native-screens';
import type { HeaderCallbacks } from 'hyperview';
import type { ParamListBase } from '@react-navigation/native';
import type { RefObject } from 'react';

export type SFSymbolIcon = Extract<
  NonNullable<NativeStackHeaderItemButton['icon']>,
  { type: 'sfSymbol' }
>;

export type ItemBackground = 'none' | 'separate' | 'shared';

type SharedHeaderItem = {
  accessibilityLabel: NativeStackHeaderItemButton['accessibilityLabel'];
  badge: string | undefined;
  disabled: NonNullable<NativeStackHeaderItemButton['disabled']>;
  itemBackground: ItemBackground;
  icon: SFSymbolIcon | undefined;
  id: string;
  label: NativeStackHeaderItemButton['label'] | undefined;
  variant: NativeStackHeaderItemButton['variant'];
};

export type HeaderButtonItem = SharedHeaderItem & {
  type: NativeStackHeaderItemButton['type'];
};

export type HeaderCustomItem = {
  element: Element;
  itemBackground: Exclude<ItemBackground, 'separate'>;
  type: 'custom';
};

export type HeaderMenuAction = Pick<
  NativeStackHeaderItemMenuAction,
  'disabled' | 'label' | 'type'
> & {
  icon?: SFSymbolIcon;
  id: string;
};

export type HeaderMenuItem = SharedHeaderItem & {
  items: HeaderMenuAction[];
  type: 'menu';
};

export type HeaderItem = HeaderButtonItem | HeaderCustomItem | HeaderMenuItem;

export type HeaderMetadata = {
  left: HeaderItem[];
  right: HeaderItem[];
  searchPlacement: SearchBarPlacement | undefined;
  searchPlaceholder: string | undefined;
  searchTarget: string | undefined;
  title: string;
  titleElement: Element | undefined;
  titleMode: 'compact' | 'large';
};

export type NativeSearchBinding = {
  onChangeText: HeaderCallbacks['onChangeText'];
  ref: RefObject<SearchBarCommands | null>;
};

export type HeaderNavigation = NativeStackNavigationProp<ParamListBase>;
