import { HvNodeError } from './hv-node-error';

export class HvElementError extends HvNodeError {
  name = 'HvElementError';

  constructor(message: string, element: Node) {
    super(message, element);
    if (this.constructor === HvElementError) {
      throw new Error('Do not instantiate `HvElementError` directly');
    }
  }

  getElement(): Element {
    return this.node as Element;
  }
}
