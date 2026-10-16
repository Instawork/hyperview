import * as ErrorService from 'hyperview/src/services/error';

export class BehaviorCopyToClipboardError extends ErrorService.HvElementError {
  name = 'BehaviorCopyToClipboardError';

  constructor(element: Element, attributeName: string) {
    super(
      `[behaviors/copy-to-clipboard]: missing "${attributeName}" attribute`,
      element,
    );
    this.setExtraContext('attributeName', attributeName);
  }
}
