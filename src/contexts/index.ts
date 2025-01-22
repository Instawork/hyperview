import type { ComponentType } from 'react';
import type { HvComponentOnUpdate } from 'hyperview/src/types';
import React from 'react';
import type { RefreshControlProps } from 'react-native';

// Provides the date format function to use in date fields
// in the screen. Default to ISO string format.
export const DateFormatContext = React.createContext<
  (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined
>(date => (date ? date.toISOString() : ''));

export const RefreshControlComponentContext = React.createContext<
  ComponentType<RefreshControlProps> | undefined
>(undefined);

export type DocContextProps = {
  getDoc: () => Document | undefined;
  setDoc?: (doc: Document) => void;
};
export const DocContext = React.createContext<DocContextProps | null>(null);

export const OnUpdateContext = React.createContext<{
  onUpdate: HvComponentOnUpdate;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ onUpdate: () => {} });

export {
  CacheProvider as ElementCacheProvider,
  Context as ElementCacheContext,
} from 'hyperview/src/contexts/element-cache';
