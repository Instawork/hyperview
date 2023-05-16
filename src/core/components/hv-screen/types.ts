/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Document, HvBehavior, HvComponent } from 'hyperview/src/types';
import {
  NavigationProp,
  Route,
} from 'hyperview/src/services/navigator/imports';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error/types';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading/types';
import React from 'react';

/**
 * Props required by other contexts
 */
export type ContextProps = {
  formatDate: (
    date: Date | null | undefined,
    format: string | null | undefined,
  ) => string;
  refreshControl: React.ComponentType<unknown>;
};

/**
 * Props used by navigation components
 */
export type NavigationProps = {
  navigation?: NavigationProp<string>;
  route?: Route<string>;
};

/**
 * Props used for data fetching
 */
export type DataProps = {
  entrypointUrl: string;
  url?: string;
  fetch: (input: string, init: object) => string;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  doc?: Document;
};

/**
 * Props used by legacy external navigation components
 */
export type ActionProps = {
  back?: () => void;
  closeModal?: () => void;
  navigate?: (params: object, key: string) => void;
  openModal?: (params: object) => void;
  push?: (params: object) => void;
};

/**
 * Props used just by hv-screen
 */
export type ComponentProps = {
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: React.ComponentType<ErrorProps>;
  errorScreen?: React.ComponentType<ErrorProps>;
  loadingScreen?: React.ComponentType<LoadingProps>;
};

/**
 * All of the props used by hv-screen
 */
export type Props = ContextProps &
  NavigationProps &
  DataProps &
  ActionProps &
  ComponentProps;
