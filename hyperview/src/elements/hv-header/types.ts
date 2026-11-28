import type { HeaderCallbacks, HvComponentProps } from 'hyperview/src/types';
import type { DebouncedFunc } from 'lodash';
import type { ReactNode } from 'react';

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
