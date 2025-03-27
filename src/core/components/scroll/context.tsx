import type { Offsets, ScrollOffset } from './types';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const Context = createContext<{
  offsets: Offsets;
  updateOffset: (viewId: string, offset: ScrollOffset) => void | undefined;
}>({
  offsets: {},
  updateOffset: () => undefined,
});

export const Provider = (props: { children: React.ReactNode }) => {
  const [offsets, setOffsets] = useState<Offsets>({});

  const updateOffset = useCallback((viewId: string, offset: ScrollOffset) => {
    setOffsets(prev => ({
      ...prev,
      [viewId]: offset,
    }));
  }, []);

  const contextValue = useMemo(() => ({ offsets, updateOffset }), [
    offsets,
    updateOffset,
  ]);

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export const useScrollContext = () => useContext(Context);
