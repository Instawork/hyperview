/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

class FormData {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  append: (arg1: string, arg2: string) => void = () => {};
}

global.FormData = FormData;
