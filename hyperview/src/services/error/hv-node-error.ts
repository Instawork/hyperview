import { HvBaseError } from './hv-base-error';

export class HvNodeError extends HvBaseError {
  name = 'HvNodeError';

  node: Node;

  constructor(message: string, node: Node) {
    super(message);
    this.node = node;
    if (this.constructor === HvNodeError) {
      throw new Error('Do not instantiate `HvNodeError` directly');
    }
  }
}
