import * as ErrorService from 'hyperview/src/services/error';

export class FetchMissingElementError extends ErrorService.HvDocError {
  name = 'FetchMissingElementError';

  constructor(doc: Document, href: string) {
    super('Element not found in document', doc);
    this.setExtraContext('href', href);
  }
}
