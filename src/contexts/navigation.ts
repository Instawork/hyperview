/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { HvBehavior, HvComponent } from 'hyperview/src/types';

import React, { ComponentType, ReactNode } from 'react';

import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';

export type NavigationContextProps = {
  entrypointUrl: string;
  fetch: (
    input: string,
    init: { headers: { [key: string]: unknown } },
  ) => Promise<Response>;
  onError?: (error: Error) => void;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  url?: string;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
};

/**
 * Context used by to provide initial values to the navigation components
 */
export const Context = React.createContext<NavigationContextProps | null>(null);
