import * as ErrorService from 'hyperview/src/services/error';

export class BehaviorScrollError extends ErrorService.HvElementError {
  name = 'BehaviorScrollError';

  constructor(element: Element) {
    super('[behaviors/scroll]: missing "target" attribute', element);
  }
}
