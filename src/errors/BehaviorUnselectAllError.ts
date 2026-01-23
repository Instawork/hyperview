import * as ErrorService from 'hyperview/src/services/error';

export class BehaviorUnselectAllError extends ErrorService.HvElementError {
  name = 'BehaviorUnselectAllError';

  constructor(element: Element) {
    super('[behaviors/unselect-all]: missing "target" attribute', element);
  }
}
