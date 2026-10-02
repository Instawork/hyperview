import * as ErrorService from 'hyperview/src/services/error';

export class EventMissingNameError extends ErrorService.HvElementError {
  name = 'EventMissingNameError';

  constructor(element: Element) {
    super(
      'dispatch-event requires an "event-name" attribute to be present',
      element,
    );
  }
}
