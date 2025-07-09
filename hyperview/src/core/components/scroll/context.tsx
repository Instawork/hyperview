import type { Offsets, ScrollOffset } from './types';
import React, { createContext, useContext, useState } from 'react';

export const Context = createContext<{
  offsets: Offsets;
  updateOffset: (viewId: string, offset: ScrollOffset) => void | undefined;
}>({
  offsets: {},
  updateOffset: () => undefined,
});

export const Provider = (props: { children: React.ReactNode }) => {
  const [offsets, setOffsets] = useState<Offsets>({});

  const updateOffset = (viewId: string, offset: ScrollOffset) => {
    setOffsets({
      ...offsets,
      [viewId]: offset,
    });
  };

  return (
    <Context.Provider value={{ offsets, updateOffset }}>
      {props.children}
    </Context.Provider>
  );
};

export const useScrollContext = () => useContext(Context);
