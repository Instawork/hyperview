import { ExtraContext } from './types';
import { HvBaseError } from './hv-base-error';
import { XMLSerializer } from '@instawork/xmldom';

export class HvElementError extends HvBaseError {
  name = 'HvElementError';

  element: Element;

  elementString: string | null = null;

  parentString: string | null = null;

  constructor(message: string, element: Element) {
    super(message);
    this.element = element;
    if (this.constructor === HvElementError) {
      throw new Error('Do not instantiate `HvElementError` directly');
    }
  }

  getExtraContext(): ExtraContext {
    if (!this.elementString || !this.parentString) {
      const serializer = new XMLSerializer();
      this.elementString = serializer.serializeToString(this.element);
      if (this.element.parentNode) {
        this.parentString = serializer.serializeToString(
          this.element.parentNode as Element,
        );
      } else {
        this.parentString = '';
      }
    }

    return {
      ...super.getExtraContext(),
      element: this.elementString,
      parent: this.parentString,
    };
  }
}
