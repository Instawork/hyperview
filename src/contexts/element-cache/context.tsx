import React, { createContext, useCallback, useContext, useRef } from 'react';
import type { Props } from './types';

/**
 * Context used to store runtime pointers to elements in the DOM.
 */
const Context = createContext<Props | undefined>(undefined);

export const Provider = (props: { children: React.ReactNode }) => {
  const elementMap = useRef<Map<number, Element>>(new Map());

  const setElement = useCallback(
    (key: number, element: Element) => {
      elementMap.current.set(key, element);
    },
    [elementMap],
  );

  const getElement = useCallback(
    (key: number): Element | undefined => {
      return elementMap.current.get(key);
    },
    [elementMap],
  );

  const removeElement = useCallback(
    (key: number) => {
      elementMap.current.delete(key);
    },
    [elementMap],
  );

  return (
    <Context.Provider
      value={{
        getElement,
        removeElement,
        setElement,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const useElementCache = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Trying to use ElementCache context without provider');
  }
  return context;
};
