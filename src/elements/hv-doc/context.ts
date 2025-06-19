import { createContext, useContext } from 'react';
import { StateProps } from './types';

const defaultCallbacks = {
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
  onUpdateCallbacks: defaultCallbacks,
  reload: () => null,
  setDoc: () => undefined,
  setScreenState: () => undefined,
});

export const useDocStateContext = () => useContext(Context);
