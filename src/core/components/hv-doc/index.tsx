import React, { useRef, useState } from 'react';
import { Props } from './types';
import { ScreenState } from 'hyperview/src/types';
import { StateContext } from './context';

const HvDoc = (props: Props) => {
  // <HACK>
  // In addition to storing the document on the react state, we keep a reference to it.
  // When performing batched updates on the DOM, we need to ensure every
  // update occurence operates on the latest DOM version. We cannot rely on `state` right after
  // setting it with `setState`, because React does not guarantee the new state to be immediately
  // available (see details here: https://reactjs.org/docs/react-component.html#setstate)
  // Whenever we need to access the document for reasons other than rendering, we should use
  // `localDoc`. When rendering, we should use `document`.
  const localDoc = useRef<Document | null>(null);
  const [state, setState] = useState<ScreenState>({
    doc: undefined,
    error: undefined,
  });

  return (
    <StateContext.Provider
      value={{
        getLocalDoc: () => localDoc.current,
        getState: () => state,
        setLocalDoc: (doc: Document | null) => {
          if (doc !== null) {
            localDoc.current = doc;
          }
        },
        // * Override the state to clear the doc when an element is passed
        setState: (newState: ScreenState) =>
          setState({ ...newState, doc: props.element ? null : newState.doc }),
      }}
    >
      <>{props.children}</>
    </StateContext.Provider>
  );
};

export default HvDoc;
export { StateContext };
