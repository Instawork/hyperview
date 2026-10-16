/* eslint-disable instawork/error-object */
/* eslint-disable max-classes-per-file */

import * as ErrorService from 'hyperview/src/services/error';

export class HvScreenRenderError extends ErrorService.HvBaseError {
  name = 'HvScreenRenderError';
}
