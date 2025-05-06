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
  setState: () => undefined,
  updateUrl: () => null,
};

export const StateContext = createContext<StateContextProps>({
  getLocalDoc: () => null,
  getScreenState: () => ({}),
  onUpdate: () => undefined,
  onUpdateCallbacks: callbacks,
  reload: () => null,
  setScreenState: () => undefined,
});
