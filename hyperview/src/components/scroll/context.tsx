import type {
  ContextValue,
  Offsets,
  ProviderProps,
  ScrollOffset,
} from './types';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const Context = createContext<ContextValue>({
  automaticContentInsets: false,
  offsets: {},
  updateOffset: () => undefined,
});

export const Provider = (props: ProviderProps) => {
  const [offsets, setOffsets] = useState<Offsets>({});

  const updateOffset = useCallback((viewId: string, offset: ScrollOffset) => {
    setOffsets(currentOffsets => ({
      ...currentOffsets,
      [viewId]: offset,
    }));
  }, []);

  const value = useMemo(
    () => ({
      automaticContentInsets: props.automaticContentInsets,
      offsets,
      updateOffset,
    }),
    [props.automaticContentInsets, offsets, updateOffset],
  );

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export const useScrollContext = () => useContext(Context);
