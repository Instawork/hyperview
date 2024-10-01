import React, { createContext, useState } from 'react';
import type { HvComponentProps } from 'hyperview';

type ElementProps = Record<string, HvComponentProps>;

/**
 * React context that provides the Hyperview demo app with a state
 * holding the navigation elements rendered by each screens that
 * React navigation navigators use to drive navigation.
 */
export const BottomTabBarContext = createContext<{
  elementsProps: ElementProps | undefined;
  setElementProps: ((id: string, props: HvComponentProps) => void) | undefined;
}>({
  elementsProps: undefined,
  setElementProps: undefined,
});

export function BottomTabBarContextProvider(props: {
  children: React.ReactNode;
}) {
  const [elementsProps, setElementsProps] = useState<ElementProps>({});
  return (
    <BottomTabBarContext.Provider
      value={{
        elementsProps,
        setElementProps: (id: string, p: HvComponentProps) => {
          setElementsProps({ ...elementsProps, [id]: p });
        },
      }}
    >
      {props.children}
    </BottomTabBarContext.Provider>
  );
}
