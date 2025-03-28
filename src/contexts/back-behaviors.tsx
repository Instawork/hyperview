import React, {
  ReactNode,
  createContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { HvComponentOnUpdate } from 'hyperview/src/types';

export type BackBehaviorContextProps = {
  add: (elements: Element[], onUpdate: HvComponentOnUpdate) => void;
  get: () => Element[];
  onUpdate: HvComponentOnUpdate;
  remove: (elements: Element[]) => void;
};

/*
 * Provides a registry of back behaviors to allow sharing between hv-screen and hv-route
 * Additionally contains the onUpdate to use for the behaviors
 */
export const BackBehaviorContext = createContext<BackBehaviorContextProps | null>(
  null,
);

export function removeElements(
  registry: Element[],
  remove: Element[],
): Element[] {
  return remove.reduce((acc, e) => {
    const i = acc.indexOf(e);
    return i > -1 ? [...acc.slice(0, i), ...acc.slice(i + 1)] : acc;
  }, registry);
}

export function BackBehaviorProvider(props: { children: ReactNode }) {
  const registry = useRef<Element[]>([]);
  const [onUpdate, setOnUpdate] = useState<HvComponentOnUpdate>(() => null);

  const add = (elements: Element[], update: HvComponentOnUpdate): void => {
    if (elements.length === 0) {
      return;
    }
    registry.current.push(...elements);
    setOnUpdate(() => update);
  };

  const get = (): Element[] => registry.current;

  const remove = (elements: Element[]): void => {
    registry.current = removeElements(registry.current, elements);
  };

  const contextValue = useMemo(
    () => ({
      add,
      get,
      onUpdate,
      remove,
    }),
    [onUpdate],
  );

  return (
    <BackBehaviorContext.Provider value={contextValue}>
      {props.children}
    </BackBehaviorContext.Provider>
  );
}
