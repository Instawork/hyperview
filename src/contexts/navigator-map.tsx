/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { createContext, useState } from 'react';

export type NavigatorMapContextProps = {
  setRoute: (key: string, route: string) => void;
  getRoute: (key: string) => string | undefined;
  setElement: (key: string, element: Element) => void;
  getElement: (key: string) => Element | undefined;
  setPreload: (key: number, element: Element) => void;
  getPreload: (key: number) => Element | undefined;
  initialRouteName?: string;
};

/**
 * Context used to store runtime information about the navigator and urls
 * Each navigator creates its own context
 *  - routeMap: Urls defined in <nav-route> elements are stored in the routeMap by their key
 *  - elementMap: Contains element sub-navigators defined in a <nav-route> element
 *  - initialRouteName: The name of the first route to render
 *  - preloadMap: A map of preload elements by their id
 */
export const NavigatorMapContext = createContext<NavigatorMapContextProps>({
  getElement: () => undefined,
  getPreload: () => undefined,
  getRoute: () => '',
  setElement: () => undefined,
  setPreload: () => undefined,
  setRoute: () => undefined,
});

type Props = { children: React.ReactNode };

/**
 * Encapsulated context provider. The maps are intentionally not updating state; their purpose is to
 * store runtime information about the navigator and urls.
 */
export function NavigatorMapProvider(props: Props) {
  const [routeMap] = useState<Map<string, string>>(new Map());
  const [elementMap] = useState<Map<string, Element>>(new Map());
  const [preloadMap] = useState<Map<number, Element>>(new Map());

  const setRoute = (key: string, route: string) => {
    routeMap.set(key, route);
  };

  const getRoute = (key: string): string | undefined => {
    return routeMap.get(key);
  };

  const setElement = (key: string, element: Element) => {
    elementMap.set(key, element);
  };

  const getElement = (key: string): Element | undefined => {
    return elementMap.get(key);
  };

  const setPreload = (key: number, element: Element) => {
    preloadMap.set(key, element);
  };

  const getPreload = (key: number): Element | undefined => {
    return preloadMap.get(key);
  };

  return (
    <NavigatorMapContext.Provider
      value={{
        getElement,
        getPreload,
        getRoute,
        setElement,
        setPreload,
        setRoute,
      }}
    >
      {props.children}
    </NavigatorMapContext.Provider>
  );
}
