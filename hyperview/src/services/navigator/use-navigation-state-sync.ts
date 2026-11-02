import type { NavigationStateSyncOptions } from './types';
import { synchronizeNavigationState } from './helpers';
import { useLayoutEffect } from 'react';

export const useNavigationStateSync = ({
  entrypointUrl,
  getDoc,
  navigatorId,
  setDoc,
  state,
}: NavigationStateSyncOptions) => {
  useLayoutEffect(() => {
    synchronizeNavigationState(
      getDoc(),
      navigatorId,
      state,
      entrypointUrl,
      setDoc,
    );
  }, [entrypointUrl, getDoc, navigatorId, setDoc, state]);
};
