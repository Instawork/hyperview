import * as ErrorService from 'hyperview/src/services/error';

export class UpdateMissingBehaviorElementError extends ErrorService.HvElementError {
  name = 'UpdateMissingBehaviorElementError';

  constructor(element: Element, action: string) {
    super('Action requires a behaviorElement', element);
    this.setExtraContext('action', action);
  }
}
