import * as ErrorService from 'hyperview/src/services/error';
import type { UpdateAction } from 'hyperview/src/types';

export class UpdateBehaviorTargetError extends ErrorService.HvElementError {
  name = 'UpdateBehaviorTargetError';

  constructor(element: Element, action: UpdateAction) {
    super(
      'Cannot find a behavior element to perform action, it may be missing an id',
      element,
    );
    this.setExtraContext('action', action);
  }
}
