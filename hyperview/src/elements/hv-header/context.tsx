import React, { createContext, useContext } from 'react';
import type { CallbacksProviderProps } from './types';
import type { HeaderCallbacks } from 'hyperview/src/types';

const Context = createContext<HeaderCallbacks | undefined>(undefined);

export const HeaderCallbacksProvider = (props: CallbacksProviderProps) => (
  <Context.Provider value={props.callbacks}>{props.children}</Context.Provider>
);

export const useHeaderCallbacksContext = () => useContext(Context);
