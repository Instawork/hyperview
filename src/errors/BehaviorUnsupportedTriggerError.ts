import * as ErrorService from 'hyperview/src/services/error';

export class BehaviorUnsupportedTriggerError extends ErrorService.HvElementError {
  name = 'BehaviorUnsupportedTriggerError';

  constructor(element: Element, trigger: string, supportedTriggers: string[]) {
    super('Unsupported trigger found', element);
    this.setExtraContext('trigger', trigger);
    this.setExtraContext('supportedTriggers', supportedTriggers);
  }
}
