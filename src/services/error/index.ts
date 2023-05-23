/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

type ExtraContext = { [key: string]: unknown };

export class HvBaseError extends Error {
  extraContext: ExtraContext = {};

  name = 'HvBaseError';

  constructor(message: string) {
    super(message);
    if (this.constructor === HvBaseError) {
      throw new Error('Do not instantiate `HvBaseError` directly');
    }
  }

  castExtraContextValue = (value: unknown): string => {
    switch (typeof value) {
      case 'string':
        return value;
      case 'function':
        return value.name || 'anonymous function';
      case 'boolean':
      case 'undefined':
      case 'number':
        return String(value);
      case 'object':
      default:
        return JSON.stringify(value);
    }
  };

  setExtraContext: (key: string, value: unknown) => void = (
    key: string,
    value: unknown,
  ) => {
    this.extraContext[key] = this.castExtraContextValue(value);
  };

  getExtraContext(): ExtraContext {
    return this.extraContext;
  }

  getFingerprint(): string[] {
    return [this.name, this.message];
  }
}
