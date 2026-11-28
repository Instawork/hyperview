import type { HeaderCallbacks, HvComponentProps } from 'hyperview/src/types';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type { ReactElement, ReactNode } from 'react';
import type { DebouncedFunc } from 'lodash';
import type { ParamListBase } from '@react-navigation/native';

export type DebouncedChange = {
  delay: number;
  trigger: DebouncedFunc<() => void>;
};

export type CallbacksProviderProps = {
  callbacks: HeaderCallbacks;
  children: ReactNode;
};

export type ContentProps = HvComponentProps & {
  callbacks: HeaderCallbacks;
};

export type ProviderProps = HvComponentProps & {
  children: (nativeHeaderActive: boolean) => ReactElement;
};

export type NativeHeaderNavigation = NativeStackNavigationProp<ParamListBase>;

export type NativeHeaderInitializerProps = {
  onInitialized: () => void;
  options: NativeStackNavigationOptions;
};
