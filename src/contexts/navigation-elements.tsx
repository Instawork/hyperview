import React, { ReactNode, createContext, useState } from 'react';

export type Props = {
  getFooter: () => React.ReactNode | undefined;
  setFooter?: (element: React.ReactNode) => void;
};

/*
 * Provides access to navigation elements
 */
export const NavigationElementContext = createContext<Props | null>(null);

export function NavigationElementProvider(props: { children: ReactNode }) {
  const [footer, setFooterVal] = useState<React.ReactNode>();

  const getFooter = (): React.ReactNode | undefined => footer;

  const setFooter = (element: React.ReactNode): void => {
    setFooterVal(() => element);
  };

  return (
    <NavigationElementContext.Provider
      value={{
        getFooter,
        setFooter,
      }}
    >
      {props.children}
    </NavigationElementContext.Provider>
  );
}
