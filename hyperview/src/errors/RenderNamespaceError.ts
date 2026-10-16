import * as ErrorService from 'hyperview/src/services/error';

export class RenderNamespaceError extends ErrorService.HvElementError {
  name = 'RenderNamespaceError';

  constructor(element: Element) {
    super('namespaceURI missing for node', element);
  }
}
