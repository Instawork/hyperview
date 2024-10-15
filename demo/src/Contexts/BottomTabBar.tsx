import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import type { HvComponentProps } from 'hyperview';

type State = Record<string, HvComponentProps>;

type Action = {
  type: string;
  payload: {
    navigator: string;
  } & Partial<{
    props: HvComponentProps;
    element: Element;
  }>;
};

/**
 * React context that provides the Hyperview demo app with a state
 * holding the navigation elements rendered by each screens that
 * React navigation navigators use to drive navigation.
 */
const Context = createContext<{
  getElementProps:
    | ((navigator: string) => HvComponentProps | undefined)
    | undefined;
  setElement: ((navigator: string, element: Element) => void) | undefined;
  setElementProps:
    | ((navigator: string, props: HvComponentProps) => void)
    | undefined;
}>({
  getElementProps: undefined,
  setElement: undefined,
  setElementProps: undefined,
});

const initialState: State = {};

type Reducer<S, A> = (prevState: S, action: A) => S;

const reducer: Reducer<State, Action> = (
  state: State = initialState,
  action: Action,
) => {
  const { element, navigator, props } = action.payload;
  switch (action.type) {
    case 'SET_ELEMENT_PROPS':
      if (!props) {
        return state;
      }
      return {
        ...state,
        [navigator]: props,
      };
    case 'SET_ELEMENT':
      if (!element) {
        return state;
      }
      return {
        ...state,
        [navigator]: {
          ...(state[navigator] || {}),
          element,
        },
      };
    default:
      return state;
  }
};

export function BottomTabBarContextProvider(p: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getElementProps = useCallback(
    (navigator: string) => {
      return state[navigator];
    },
    [state],
  );
  const setElement = useCallback(
    (navigator: string, element: Element) => {
      dispatch({
        payload: {
          element,
          navigator,
        },
        type: 'SET_ELEMENT',
      });
    },
    [dispatch],
  );
  const setElementProps = useCallback(
    (navigator: string, props: HvComponentProps) => {
      dispatch({
        payload: {
          navigator,
          props,
        },
        type: 'SET_ELEMENT_PROPS',
      });
    },
    [dispatch],
  );
  return (
    <Context.Provider value={{ getElementProps, setElement, setElementProps }}>
      {p.children}
    </Context.Provider>
  );
}

export const useBottomTabBarContext = () => useContext(Context);
