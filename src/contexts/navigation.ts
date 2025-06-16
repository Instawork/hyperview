import type {
  DOMString,
  ExperimentalFeatures,
  Fetch,
  HvBehavior,
  HvComponent,
  HvComponentOnUpdate,
  HvComponentOptions,
  Route,
} from 'hyperview/src/types';
import React, { ComponentType } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';
import type { NavigationComponents } from 'hyperview/src/services/navigator';

type Reload = (
  optHref: DOMString | null | undefined,
  opts: HvComponentOptions,
) => void;

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
  navigationComponents?: NavigationComponents;
  experimentalFeatures?: ExperimentalFeatures;
};

/**
 * Context used by to provide initial values to the navigation components
 */
export const Context = React.createContext<NavigationContextProps | null>(null);
