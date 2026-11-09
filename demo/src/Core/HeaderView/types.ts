import type {
  NativeStackHeaderItem,
  NativeStackHeaderItemButton,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import type {
  NavigationProp,
  NavigationState,
  ParamListBase,
} from '@react-navigation/native';

export type HeaderIcon = NonNullable<NativeStackHeaderItemButton['icon']>;

export type HeaderIconMetadataType = 'sfSymbol' | 'xcasset';

export type SFSymbolIcon = Extract<HeaderIcon, { type: 'sfSymbol' }>;

export type HeaderItem = {
  disabled: boolean;
  element: Element;
  icon: HeaderIcon | undefined;
  label: string | undefined;
  testID: string | undefined;
};

export type HeaderMetadata = {
  left: HeaderItem[];
  right: HeaderItem[];
  title: string;
};

export type NativeHeaderItem = NativeStackHeaderItem;

export type NativeHeaderOptions = NativeStackNavigationOptions;

export type HeaderNavigation = NavigationProp<
  ParamListBase,
  string,
  string | undefined,
  NavigationState<ParamListBase>,
  NativeHeaderOptions
>;
