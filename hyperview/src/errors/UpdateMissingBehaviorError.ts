import * as ErrorService from 'hyperview/src/services/error';

export class UpdateMissingBehaviorError extends ErrorService.HvElementError {
  name = 'UpdateMissingBehaviorError';

  constructor(element: Element, action: string) {
    super('No behavior registered for action', element);
    this.setExtraContext('action', action);
  }
}
