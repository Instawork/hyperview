import { StateProps } from './types';
import { createContext } from 'react';

const callbacks = {
  clearElementError: () => undefined,
  getDoc: () => undefined,
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

export const Context = createContext<StateProps>({
  getDoc: () => undefined,
  getScreenState: () => ({}),
  onUpdate: () => undefined,
  onUpdateCallbacks: callbacks,
  reload: () => null,
  setScreenState: () => undefined,
});
