import * as ErrorService from 'hyperview/src/services/error';

export class ElementTextError extends ErrorService.HvElementError {
  name = 'ElementTextError';

  constructor(element: Element, text: string) {
    super('Text string must be rendered within a <text> element', element);
    this.setExtraContext('text', text);
  }
}
