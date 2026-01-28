import * as ErrorService from 'hyperview/src/services/error';

export class EventTriggerError extends ErrorService.HvElementError {
  name = 'EventTriggerError';

  constructor(element: Element) {
    super(
      'trigger="on-event" and action="dispatch-event" cannot be used on the same element',
      element,
    );
  }
}
