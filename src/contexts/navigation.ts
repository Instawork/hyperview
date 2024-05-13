import type {
  Fetch,
  HvBehavior,
  HvComponent,
  HvComponentOnUpdate,
  Log,
  Reload,
  Route,
} from 'hyperview/src/types';
import React, { ComponentType, ReactNode } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';

export type NavigationContextProps = {
  entrypointUrl: string;
  fetch: Fetch;
  onError?: (error: Error) => void;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  onRouteBlur?: (route: Route) => void;
  onRouteFocus?: (route: Route) => void;
  onUpdate: HvComponentOnUpdate;
  reload: Reload;
  url?: string;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
  log?: Log;
};

/**
 * Context used by to provide initial values to the navigation components
 */
export const Context = React.createContext<NavigationContextProps | null>(null);
