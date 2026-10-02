import { HvNodeError } from './hv-node-error';

export class HvDocError extends HvNodeError {
  name = 'HvDocError';

  constructor(message: string, document: Node) {
    super(message, document);
    if (this.constructor === HvDocError) {
      throw new Error('Do not instantiate `HvDocError` directly');
    }
  }

  getDocument(): Document {
    return this.node as Document;
  }
}
