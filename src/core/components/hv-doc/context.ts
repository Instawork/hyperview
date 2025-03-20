import { StateContextProps } from './types';
import { createContext } from 'react';

export const StateContext = createContext<StateContextProps>({
  getLocalDoc: () => null,
  getState: () => ({}),
  setLocalDoc: () => ({}),
  setState: () => ({}),
});
