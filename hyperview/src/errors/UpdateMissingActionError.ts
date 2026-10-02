import * as ErrorService from 'hyperview/src/services/error';

export class UpdateMissingActionError extends ErrorService.HvElementError {
  name = 'UpdateMissingActionError';

  constructor(element: Element) {
    super('Custom behavior requires an "action" attribute', element);
  }
}
