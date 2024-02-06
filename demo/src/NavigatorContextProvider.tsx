/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HvBehavior } from 'hyperview';
import { ReactNode, createContext, useState } from 'react';

const NAMESPACE_URI = 'https://instawork.com/hyperview-set-navigator';

export const NavigatorContext = createContext<{
  getCallbacks: HvBehavior[];
  useHXMLNavigator: boolean;
} | null>(null);

export function NavigatorContextProvider(props: { children: ReactNode }) {
  const [useHXMLNavigator, setUseHXMLNavigator] = useState(false);

  /**
   * Create a custom behavior to toggle using HXML to define the navigator hierarchy
   */
  const toggleNavigatorBehavior = {
    action: 'set-navigator',
    callback: (element: Element) => {
      const type = element.getAttributeNS(NAMESPACE_URI, 'type');
      if (type === 'hxml') {
        setUseHXMLNavigator(true);
      } else if (type === 'external') {
        setUseHXMLNavigator(false);
      }
    },
  };

  return (
    <NavigatorContext.Provider
      value={{
        getCallbacks: [toggleNavigatorBehavior],
        useHXMLNavigator,
      }}
    >
      {props.children}
    </NavigatorContext.Provider>
  );
}
