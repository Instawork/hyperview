/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable instawork/error-object */
/* eslint-disable max-classes-per-file */

import * as ErrorService from 'hyperview/src/services/error';

export class HvRouteError extends ErrorService.HvBaseError {
  name = 'HvRouteError';
}

export class HvNavigatorError extends ErrorService.HvBaseError {
  name = 'HvNavigatorError';
}

export class HvRenderError extends ErrorService.HvBaseError {
  name = 'HvRenderError';
}
