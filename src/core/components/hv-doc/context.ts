import { StateContextProps } from './types';
import { createContext } from 'react';

const callbacks = {
  clearElementError: () => undefined,
  getDoc: () => null,
  getNavigation: () => ({
    backAction: () => undefined,
    navigate: () => undefined,
    openModalAction: () => undefined,
  }),
  getOnUpdate: () => () => undefined,
  getState: () => ({}),
  setNeedsLoad: () => null,
  setState: () => undefined,
};

export const StateContext = createContext<StateContextProps>({
  getLocalDoc: () => null,
  getScreenState: () => ({}),
  onUpdate: () => undefined,
  onUpdateCallbacks: callbacks,
  reload: () => null,
  setNeedsLoadCallback: () => null,
  setScreenState: () => undefined,
});
