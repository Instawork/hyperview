import React, { ComponentType, ReactNode, createContext, useRef } from 'react';
import Loading from 'hyperview/src/core/components/loading';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';

type Props = {
  get: (id?: string) => ComponentType<LoadingProps>;
};

/*
 * Centralizes implementation of default loading screen:
 * - If a loading screen is passed in props, it will be used as the default screen
 * - If no loading screen is passed, the default screen will be the local `Loading` component
 */
export const LoadingScreenContext = createContext<Props>({
  get: () => Loading,
});

export function LoadingScreenProvider(props: {
  children: ReactNode;
  loadingScreen?: ComponentType<LoadingProps>;
}) {
  const registry = useRef<{ [key: string]: ComponentType<LoadingProps> }>({});

  if (props.loadingScreen) {
    // Inject the props.loadingScreen as the default screen
    registry.current.default = props.loadingScreen;
  } else {
    // Fallback to the local component
    registry.current.default = Loading;
  }

  /**
   * Get a loading screen component by id
   * @param id - The id of the loading screen component to retrieve
   * @returns The loading screen component by id or the default screen if no id is provided
   */
  const get = (id?: string): ComponentType<LoadingProps> =>
    registry.current[id || 'default'];

  return (
    <LoadingScreenContext.Provider
      value={{
        get,
      }}
    >
      {props.children}
    </LoadingScreenContext.Provider>
  );
}

LoadingScreenProvider.defaultProps = {
  loadingScreen: undefined,
};
