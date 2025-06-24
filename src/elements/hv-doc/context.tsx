import React, { ConsumerProps, createContext, useContext } from 'react';
import { ContextProps } from './types';

export const Context = createContext<ContextProps | undefined>(undefined);

export const useHvDoc = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Trying to use HvDoc context without provider');
  }
  return context;
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
