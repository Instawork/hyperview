import React, { useContext } from 'react';
import { Props } from './types';

/**
 * Context used to store external dependencies.
 */
export const Context = React.createContext<Props>({
  entrypointUrl: '',
  fetch: () => Promise.resolve(new Response()),
  formatDate: () => '',
  onUpdate: () => null,
  reload: () => null,
});

export const useHyperview = () => useContext(Context);
