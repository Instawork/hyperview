/* eslint-disable instawork/error-object */
/* eslint-disable max-classes-per-file */
/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Error from 'hyperview/src/services/error';

export class HvRouteError extends Error.HvBaseError {
  name = 'HvRouteError';
}

export class HvNavigatorError extends Error.HvBaseError {
  name = 'HvNavigatorError';
}

export class HvRenderError extends Error.HvBaseError {
  name = 'HvRenderError';
}
