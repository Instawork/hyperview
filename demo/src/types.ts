/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { NavigationRouteParams } from 'hyperview';
import type { StackScreenProps } from '@react-navigation/stack';

export type RouteParams = NavigationRouteParams & { modal?: boolean };

export type RootStackParamList = {
  Main: RouteParams;
  Modal: RouteParams;
};

export type Props = StackScreenProps<RootStackParamList>;
