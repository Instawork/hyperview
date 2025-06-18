import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { BackBehaviorContextProps } from './types';
import { HvComponentOnUpdate } from 'hyperview/src/types';

/*
 * Provides a registry of back behaviors to allow sharing between hv-screen and hv-route
 * Additionally contains the onUpdate to use for the behaviors
 */
export const Context = createContext<BackBehaviorContextProps | null>(null);

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
  const registry = useRef<Element[]>([]);
  const [onUpdate, setOnUpdate] = useState<HvComponentOnUpdate>(() => null);

  const add = useCallback(
    (elements: Element[], update: HvComponentOnUpdate): void => {
      if (elements.length === 0) {
        return;
      }
      registry.current.push(...elements);
      setOnUpdate(() => update);
    },
    [],
  );

  const get = useCallback((): Element[] => registry.current, []);

  const remove = useCallback((elements: Element[]): void => {
    registry.current = removeElements(registry.current, elements);
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

export const useBackBehaviorContext = () => useContext(Context);
