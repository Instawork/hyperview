// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Type needed to expose a method in FormData that default Flow types don't know about
export type FormDataGetParts = {
  getParts: () => Array<{ fieldName: string, string: string }>,
};
