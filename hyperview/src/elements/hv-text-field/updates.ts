import * as Behaviors from 'hyperview/src/services/behaviors';
import type { HvComponentOnUpdate } from 'hyperview/src/types';
import type { TextFieldBehaviorTrigger } from './types';
import TinyMask from './mask';

export const getDebounceTime = (element: Element) =>
  parseInt(element.getAttribute('debounce') || '', 10) || 0;

export const getFormattedValue = (element: Element, value: string) => {
  if (!element.hasAttribute('mask')) {
    return value;
  }
  const mask = new TinyMask(element.getAttribute('mask'));
  // TinyMask returns undefined in some cases (like if the value is an empty string).
  // In those situations, we want the formatted value to be an empty string
  // (for proper serialization).
  return mask.mask(value) || '';
};

export const updateTextFieldValue = (
  element: Element,
  value: string,
  onUpdate: HvComponentOnUpdate,
) => {
  const newElement = element.cloneNode(true) as Element;
  newElement.setAttribute('value', getFormattedValue(element, value));
  onUpdate(null, 'swap', element, { newElement });
  return newElement;
};

export const updateTextFieldFocus = (
  element: Element,
  focused: boolean,
  onUpdate: HvComponentOnUpdate,
): Element => {
  const newElement = element.cloneNode(true) as Element;
  onUpdate(null, 'swap', element, { newElement });
  triggerTextFieldBehavior(focused ? 'focus' : 'blur', newElement, onUpdate);
  return newElement;
};

export const triggerTextFieldBehavior = (
  trigger: TextFieldBehaviorTrigger,
  element: Element,
  onUpdate: HvComponentOnUpdate,
) => Behaviors.trigger(trigger, element, onUpdate);
