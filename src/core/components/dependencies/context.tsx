import type { Dependencies, Props } from './types';
import React, { useCallback, useContext } from 'react';
import { DefaultDateFormatter } from './index';

/**
 * Context used to store external dependencies.
 */
export const Context = React.createContext<Dependencies | null>(null);

export const Provider = (props: Props & { children: React.ReactNode }) => {
  const dateFormatter = useCallback(
    (date: Date | null | undefined) => DefaultDateFormatter(date),
    [],
  );

  return (
    <Context.Provider
      value={{
        behaviors: props.behaviors,
        components: props.components,
        dateFormatter,
        elementErrorComponent: props.elementErrorComponent,
        entrypointUrl: props.entrypointUrl,
        errorScreen: props.errorScreen,
        experimentalFeatures: props.experimentalFeatures,
        fetch: props.fetch,
        loadingScreen: props.loadingScreen,
        navigationComponents: props.navigationComponents,
        onError: props.onError,
        onParseAfter: props.onParseAfter,
        onParseBefore: props.onParseBefore,
        onRouteBlur: props.onRouteBlur,
        onRouteFocus: props.onRouteFocus,
        onUpdate: props.onUpdate,
        refreshControl: props.refreshControl,
        reload: props.reload,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const useDependencyContext = () => useContext(Context);
