import { HvNodeError } from './hv-node-error';

export class HvDocError extends HvNodeError {
  name = 'HvDocError';

  constructor(message: string, doc: Node) {
    super(message, doc);
    if (this.constructor === HvDocError) {
      throw new Error('Do not instantiate `HvDocError` directly');
    }
  }
}
