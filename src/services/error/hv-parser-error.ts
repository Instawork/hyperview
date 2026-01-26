import { HvBaseError } from './hv-base-error';

export class HvParserError extends HvBaseError {
  name = 'HvParserError';

  constructor(
    message: string,
    content: string,
    error: string,
    status: number,
    url?: string,
  ) {
    super(message);
    this.setExtraContext('content', content);
    this.setExtraContext('error', error);
    this.setExtraContext('status', status);
    this.setExtraContext('url', url);
    if (this.constructor === HvParserError) {
      throw new Error('Do not instantiate `HvParserError` directly');
    }
  }
}
