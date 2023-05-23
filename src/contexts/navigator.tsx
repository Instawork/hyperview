/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from 'hyperview/src/services/navigator/errors';
import React, { createContext, useContext } from 'react';
import { Element } from 'hyperview/src/services/navigator/types';

type Props = { children: React.ReactNode };

export type NavigatorCache = {
  routeMap?: Map<string, string>;
  elementMap?: Map<string, Element>;
  initialRouteName?: string;
};

export const NavigatorMapContext = createContext<NavigatorCache | null>(null);

function useMapContext() {
  const context = useContext(NavigatorMapContext);
  if (context === undefined) {
    throw new Errors.HvNavigatorMapError(
      'useMapContext must be used within a NavigatorMapContext',
    );
  }
  return context;
}

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
  GetRouteUrl,
  NavigatorMapProvider,
  SetInitialRouteName,
  SetRouteUrl,
};
