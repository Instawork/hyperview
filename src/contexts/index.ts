import React from 'react';

export type DocContextProps = {
  getDoc: () => Document | undefined;
  setDoc?: (doc: Document) => void;
};
export const DocContext = React.createContext<DocContextProps | null>(null);
