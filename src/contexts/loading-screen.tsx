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
 * Provides a registry of externally provided loadingScreen components by id
 * - If no id is provided, the default screen will be used
 */
export const LoadingScreenContext = createContext<Props>({
  get: () => Loading,
});

export function LoadingScreenProvider(props: {
  children: ReactNode;
  loadingScreen?: ComponentType<LoadingProps>;
  loadingScreens?: { [key: string]: ComponentType<LoadingProps> };
}) {
  const registry = useRef<{ [key: string]: ComponentType<LoadingProps> }>(
    props.loadingScreens || {},
  );

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
  const get = (id?: string): ComponentType<LoadingProps> => {
    if (id) {
      const screen = registry.current[id];
      return screen || registry.current.default;
    }
    return registry.current.default;
  };

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
  loadingScreens: {},
};
