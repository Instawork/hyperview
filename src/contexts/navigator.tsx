/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from 'hyperview/src/services/navigator/errors';
import React, { createContext, useContext } from 'react';
import { Element } from 'hyperview/src/services/navigator/types-legacy';

type Props = { children: React.ReactNode };

export type NavigatorCache = {
  routeMap?: Map<string, string>;
  elementMap?: Map<string, Element>;
  initialRouteName?: string;
};

/**
 * Context used to store runtime information about the navigator and urls
 * Each navigator creates its own context
 * Urls defined in <route> elements are stored in the routeMap by their key
 */
const NavigatorMapContext = createContext<NavigatorCache | null>(null);

function useMapContext() {
  const context = useContext(NavigatorMapContext);
  if (context === undefined) {
    throw new Errors.HvNavigatorMapError(
      'useMapContext must be used within a NavigatorMapContext',
    );
  }
  return context;
}

/**
 * Cache the initial route name for the <navigator>
 */
function SetInitialRouteName(name: string) {
  const context = useMapContext();
  if (context) {
    context.initialRouteName = name;
  }
}

function GetInitialRouteName(): string | undefined {
  const context = useMapContext();
  return context?.initialRouteName;
}

/**
 * Cache the url for a <route> element
 */
function SetRouteUrl(key: string, url: string) {
  const context = useMapContext();
  if (context) {
    context.routeMap?.set(key, url);
  }
}

function GetRouteUrl(key: string): string | undefined {
  const context = useMapContext();
  return context?.routeMap?.get(key);
}

/**
 * Cache the navigator element for a <route> element when it contains a nested <navigator>
 */
function SetRouteNavigator(key: string, element: Element) {
  const context = useMapContext();
  if (context) {
    context.elementMap?.set(key, element);
  }
}

function GetRouteNavigator(key: string): Element | undefined {
  const context = useMapContext();
  return context?.elementMap?.get(key);
}

/**
 * Encapsulated context provider
 */
// eslint-disable-next-line react/destructuring-assignment
function NavigatorMapProvider({ children }: Props) {
  const routeMap: Map<string, string> = new Map();
  const elementMap: Map<string, Element> = new Map();
  return (
    <NavigatorMapContext.Provider value={{ elementMap, routeMap }}>
      {children}
    </NavigatorMapContext.Provider>
  );
}

export {
  GetInitialRouteName,
  GetRouteNavigator,
  GetRouteUrl,
  NavigatorMapProvider,
  SetInitialRouteName,
  SetRouteNavigator,
  SetRouteUrl,
  useMapContext,
};
