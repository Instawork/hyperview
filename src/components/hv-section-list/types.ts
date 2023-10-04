/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type State = {
  refreshing: boolean;
};

// https://reactnative.dev/docs/sectionlist#scrolltolocation
export type ScrollParams = {
<<<<<<< HEAD
  animated?: boolean | undefined;
=======
  animated?: boolean;
>>>>>>> a1c52dd (chore: migrate src/components/hv-section-list)
  itemIndex: number;
  sectionIndex: number;
  viewOffset?: number;
  viewPosition?: number;
};
