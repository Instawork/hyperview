// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type Content =
  | { title?: string, message: string }
  | { title?: string, url: string };

export type Options = {
  dialogTitle?: string,
  excludedActivityTypes?: Array<string>,
  tintColor?: string,
  subject?: string,
};
