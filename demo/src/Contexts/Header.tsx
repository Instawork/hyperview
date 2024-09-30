import React, { createContext, useState } from 'react';
import type { HvComponentProps } from 'hyperview';

type ElementProps = Record<string, HvComponentProps>;

/**
 * React context that provides the Hyperview demo app with a state
 * holding the navigation elements rendered by each screens that
 * React navigation navigators use to drive navigation.
 */
export const HeaderContext = createContext<{
  elementsProps: ElementProps | undefined;
  setElementProps: ((id: string, props: HvComponentProps) => void) | undefined;
}>({
  elementsProps: undefined,
  setElementProps: undefined,
});

export function HeaderContextProvider(props: { children: React.ReactNode }) {
  const [elementsProps, setElementsProps] = useState<ElementProps>({});
  return (
    <HeaderContext.Provider
      value={{
        elementsProps,
        setElementProps: (id: string, props: HvComponentProps) => {
          setElementsProps({ ...elementsProps, [id]: props });
        },
      }}
    >
      {props.children}
    </HeaderContext.Provider>
  );
}
