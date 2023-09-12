// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ColorValue } from './style-sheet';

type TrackColor = {|
  true: ?ColorValue,
  false: ?ColorValue,
|};

export type Colors = {|
  iosBackgroundColor: ?ColorValue,
  thumbColor: ?ColorValue,
  trackColor: TrackColor,
|};
