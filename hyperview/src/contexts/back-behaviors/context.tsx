import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import type { HvComponentOnUpdate } from 'hyperview/src/types';
import type { Props } from './types';

/*
 * Provides a registry of back behaviors to allow sharing between hv-screen and hv-route
 * Additionally contains the onUpdate to use for the behaviors
 */
export const Context = createContext<Props | undefined>(undefined);

/**
 * This is a helper function to remove elements from a registry for testing purposes
 */
export function removeElements(
  registry: Element[],
  remove: Element[],
): Element[] {
  return remove.reduce((acc, e) => {
    const i = acc.indexOf(e);
    return i > -1 ? [...acc.slice(0, i), ...acc.slice(i + 1)] : acc;
  }, registry);
}

export const Provider = (props: { children: ReactNode }) => {
  const [registry, setRegistry] = useState<Element[]>([]);
  const [onUpdate, setOnUpdate] = useState<HvComponentOnUpdate>(() => null);

  const add = useCallback(
    (elements: Element[], update: HvComponentOnUpdate): void => {
      if (elements.length === 0) {
        return;
      }
      setRegistry(currentRegistry => [...currentRegistry, ...elements]);
      setOnUpdate(() => update);
    },
    [],
  );

  const get = useCallback((): Element[] => registry, [registry]);

  const remove = useCallback((elements: Element[]): void => {
    setRegistry(currentRegistry => removeElements(currentRegistry, elements));
  }, []);

  return (
    <Context.Provider
      value={{
        add,
        get,
        onUpdate,
        remove,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const useBackBehaviorContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Trying to use BackBehavior context without provider');
  }
  return context;
};
