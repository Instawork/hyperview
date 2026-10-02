import React, { ConsumerProps, useContext } from 'react';
import type { Props } from './types';

/**
 * Context used to store external dependencies.
 */
export const Context = React.createContext<Props | undefined>(undefined);

export const useHyperview = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Trying to use Hyperview context without provider');
  }
  return context;
};

export const Consumer = (props: ConsumerProps<Props>) => {
  return (
    <Context.Consumer>
      {context => {
        if (!context) {
          throw new Error('Trying to use Hyperview context without provider');
        }
        return props.children(context);
      }}
    </Context.Consumer>
  );
};
