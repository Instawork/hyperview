import * as ErrorService from 'hyperview/src/services/error';

export class BehaviorSelectAllError extends ErrorService.HvElementError {
  name = 'BehaviorSelectAllError';

  constructor(element: Element) {
    super('[behaviors/select-all]: missing "target" attribute', element);
  }
}
