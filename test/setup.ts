/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// @ts-ignore TS2300: Duplicate identifier 'FormData'.
class FormData {
  append: (key: string, value: string) => void = () => {};
}

global.FormData = FormData;
