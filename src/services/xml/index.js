// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Splits a string by any whitespace and returns an array
 * containing only the non-whitespace tokens.
 */
export const splitAttributeList = (attr: string): Array<string> =>
  attr.match(/\S+/g) || [];
