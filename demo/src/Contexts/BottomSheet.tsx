import { createContext, useContext } from 'react';

export const Context = createContext<{
  setContentSectionHeight:
    | ((index: number, height: number) => void)
    | undefined;
}>({
  setContentSectionHeight: undefined,
});

export const useBottomSheetContext = () => useContext(Context);
