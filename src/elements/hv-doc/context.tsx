import React, { ConsumerProps, createContext, useContext } from 'react';
import { ContextProps } from './types';

export const Context = createContext<ContextProps | undefined>(undefined);

export const useHvDocContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Trying to use HvDoc context without provider');
  }
  return context;
};

/**
 * TODO: HvDoc
 * The `unsafe` version is a temporary solution
 * Since HvRoute is currently at the top of the context stack,
 * the initial route will not have access to the HvDoc context.
 *
 * Once we move HvDoc to the top of the hierarchy, we can remove this method and use
 * useHvDocContext instead
 */
export const useUnsafeHvDocContext = () => {
  return useContext(Context);
};

export const Consumer = (props: ConsumerProps<ContextProps>) => {
  return (
    <Context.Consumer>
      {context => {
        if (!context) {
          throw new Error('Trying to use HvDoc context without provider');
        }
        return props.children(context);
      }}
    </Context.Consumer>
  );
};
