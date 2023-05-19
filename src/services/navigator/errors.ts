/* eslint-disable instawork/error-object */
/* eslint-disable max-classes-per-file */
/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HvBaseError } from '../error';

export class HvRouteError extends HvBaseError {
  name = 'HvRouteError';
}

export class HvNavigatorError extends HvBaseError {
  name = 'HvNavigatorError';
}

export class HvRenderError extends HvBaseError {
  name = 'HvRenderError';
}
