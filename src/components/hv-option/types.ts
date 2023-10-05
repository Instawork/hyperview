/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type State = {
  pressed: boolean;
};

// https://reactnative.dev/docs/flatlist#scrolltoindex
export type ScrollParams = {
  animated?: boolean | undefined;
  index: number;
  viewOffset?: number;
  viewPosition?: number;
};
