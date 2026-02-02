import * as ErrorService from 'hyperview/src/services/error';

export class UpdateMissingTargetError extends ErrorService.HvDocError {
  name = 'UpdateMissingTargetError';

  constructor(doc: Document, targetId: string) {
    super('Target element not found, falling back to current element', doc);
    this.setExtraContext('targetId', targetId);
  }
}
