import type { HvComponentOnUpdate } from 'hyperview/src/types';
import React from 'react';

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
