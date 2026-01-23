import { HvBaseError } from './hv-base-error';

export class HvElementError extends HvBaseError {
  name = 'HvElementError';

  constructor(message: string, element: Element) {
    super(message);
    this.setExtraContext('element', element);
    if (this.constructor === HvElementError) {
      throw new Error('Do not instantiate `HvElementError` directly');
    }
  }
}
