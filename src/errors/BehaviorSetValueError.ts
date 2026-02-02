import * as ErrorService from 'hyperview/src/services/error';

export class BehaviorSetValueError extends ErrorService.HvElementError {
  name = 'BehaviorSetValueError';

  constructor(element: Element) {
    super('[behaviors/set-value]: missing "target" attribute', element);
  }
}
