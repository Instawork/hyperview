import { HvBaseError } from './hv-base-error';

export class HvDocError extends HvBaseError {
  name = 'HvDocError';

  constructor(message: string, doc: Document) {
    super(message);
    this.setExtraContext('doc', doc);
    if (this.constructor === HvDocError) {
      throw new Error('Do not instantiate `HvDocError` directly');
    }
  }
}
