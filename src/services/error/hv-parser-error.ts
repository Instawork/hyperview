import { HvBaseError } from './hv-base-error';

export class HvParserError extends HvBaseError {
  name = 'HvParserError';

  constructor(
    message: string,
    error: string,
    response: string,
    status: number,
  ) {
    super(message);
    this.setExtraContext('error', error);
    this.setExtraContext('response', response);
    this.setExtraContext('status', status);
    if (this.constructor === HvParserError) {
      throw new Error('Do not instantiate `HvParserError` directly');
    }
  }
}
