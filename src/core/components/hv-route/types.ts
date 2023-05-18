/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as HvScreenProps from '../hv-screen/types';

/**
 * Props used for data fetching by hv-route
 */
export type DataProps = {
  url?: string;
};

/**
 * All of the props used by hv-route
 */
export type Props = DataProps &
  HvScreenProps.DataProps &
  HvScreenProps.NavigationProps;
