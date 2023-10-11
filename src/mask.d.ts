/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

class TinyMask {
  constructor(
    pattern: string | null,
    options?: {
      translation?: Record<string, string>;
      invalidValues?: string[];
    },
  );

  mask(value: string): string;
}

export default TinyMask;
