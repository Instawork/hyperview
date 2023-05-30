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

function UseMapContext() {
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
function setInitialRouteName(name: string) {
  const context = UseMapContext();
  if (context) {
    context.initialRouteName = name;
  }
}

function getInitialRouteName(): string | undefined {
  const context = UseMapContext();
  return context?.initialRouteName;
}

/**
 * Cache the url for a <route> element
 */
function setRouteUrl(key: string, url: string) {
  const context = UseMapContext();
  if (context) {
    context.routeMap?.set(key, url);
  }
}

function getRouteUrl(key: string): string | undefined {
  const context = UseMapContext();
  return context?.routeMap?.get(key);
}

/**
 * Cache the navigator element for a <route> element when it contains a nested <navigator>
 */
function setRouteNavigator(key: string, element: Element) {
  const context = UseMapContext();
  if (context) {
    context.elementMap?.set(key, element);
  }
}

function getRouteNavigator(key: string): Element | undefined {
  const context = UseMapContext();
  return context?.elementMap?.get(key);
}

/**
 * Encapsulated context provider
 */
function NavigatorMapProvider(props: Props) {
  const routeMap: Map<string, string> = new Map();
  const elementMap: Map<string, Element> = new Map();
  return (
    <NavigatorMapContext.Provider value={{ elementMap, routeMap }}>
      {props.children}
    </NavigatorMapContext.Provider>
  );
}

export {
  getInitialRouteName,
  getRouteNavigator,
  getRouteUrl,
  NavigatorMapProvider,
  setInitialRouteName,
  setRouteNavigator,
  setRouteUrl,
  UseMapContext,
};
