import * as ErrorService from 'hyperview/src/services/error';

export class RenderLocalNameError extends ErrorService.HvElementError {
  name = 'RenderLocalNameError';

  constructor(element: Element) {
    super('localName missing for node', element);
  }
}
