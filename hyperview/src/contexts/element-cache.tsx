import React, { createContext, useState } from 'react';

export type ElementCacheProps = {
  setElement: (key: number, element: Element) => void;
  removeElement: (key: number) => void;
  getElement: (key: number) => Element | undefined;
};

/**
 * Context used to store runtime pointers to elements in the DOM.
 */
export const Context = createContext<ElementCacheProps>({
  getElement: () => undefined,
  removeElement: () => undefined,
  setElement: () => undefined,
});

type Props = { children: React.ReactNode };

/**
 * Encapsulated context provider. The maps are intentionally not updating state; their purpose is to
 * store elements for later use.
 */
export function CacheProvider(props: Props) {
  const [elementMap] = useState<Map<number, Element>>(new Map());

  const setElement = (key: number, element: Element) => {
    elementMap.set(key, element);
  };

  const getElement = (key: number): Element | undefined => {
    return elementMap.get(key);
  };

  const removeElement = (key: number) => {
    elementMap.delete(key);
  };

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
}
