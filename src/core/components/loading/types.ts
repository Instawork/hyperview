/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

<<<<<<< HEAD:src/core/components/loading/types.ts
export type Props = Record<any, any>;
=======
export type State = {|
  refreshing: boolean,
|};

// https://reactnative.dev/docs/flatlist#scrolltoindex
export type ScrollParams = {|
  animated?: ?boolean,
  index: number,
  viewOffset?: number,
  viewPosition?: number,
|};
>>>>>>> master:src/components/hv-list/types.js
