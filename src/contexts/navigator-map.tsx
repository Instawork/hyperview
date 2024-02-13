import React, { createContext, useState } from 'react';

export type NavigatorMapContextProps = {
  setPreload: (key: number, element: Element) => void;
  getPreload: (key: number) => Element | undefined;
};

/**
 * Context used to store runtime information about the navigator and urls
 * Each navigator creates its own context
 *  - routeMap: Urls defined in <nav-route> elements are stored in the routeMap by their key
 *  - elementMap: Contains element sub-navigators defined in a <nav-route> element
 *  - preloadMap: A map of preload elements by their id
 */
export const NavigatorMapContext = createContext<NavigatorMapContextProps>({
  getPreload: () => undefined,
  setPreload: () => undefined,
});

type Props = { children: React.ReactNode };

/**
 * Encapsulated context provider. The maps are intentionally not updating state; their purpose is to
 * store runtime information about the navigator and urls.
 */
export function NavigatorMapProvider(props: Props) {
  const [preloadMap] = useState<Map<number, Element>>(new Map());

  const setPreload = (key: number, element: Element) => {
    preloadMap.set(key, element);
  };

  const getPreload = (key: number): Element | undefined => {
    return preloadMap.get(key);
  };

  return (
    <NavigatorMapContext.Provider
      value={{
        getPreload,
        setPreload,
      }}
    >
      {props.children}
    </NavigatorMapContext.Provider>
  );
}
