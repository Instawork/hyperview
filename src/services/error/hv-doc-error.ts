import { ExtraContext } from './types';
import { HvBaseError } from './hv-base-error';
import { XMLSerializer } from '@instawork/xmldom';

export class HvDocError extends HvBaseError {
  name = 'HvDocError';

  doc: Document;

  docString: string | null = null;

  constructor(message: string, doc: Document) {
    super(message);
    this.doc = doc;
    if (this.constructor === HvDocError) {
      throw new Error('Do not instantiate `HvDocError` directly');
    }
  }

  getExtraContext(): ExtraContext {
    if (!this.docString) {
      const serializer = new XMLSerializer();
      this.docString = serializer.serializeToString(this.doc);
    }
    return {
      ...super.getExtraContext(),
      doc: this.docString,
    };
  }
}
