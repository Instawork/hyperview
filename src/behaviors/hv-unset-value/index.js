// @flow

import type {
  DOMString,
  Document,
  Element,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
} from 'hyperview/src/types';
import { later, shallowCloneToRoot } from 'hyperview/src/services';

export default {
  action: 'unset-value',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {
    console.log('unset-value');
    const targetId: ?DOMString = element.getAttribute('target');
    if (!targetId) {
      console.warn('[behaviors/unset-value]: missing "target" attribute');
      return;
    }

    const delayAttr: string = element.getAttribute('delay') || '0';
    const parsedDelay: number = parseInt(delayAttr, 10);
    const delay: number = Number.isNaN(parsedDelay) ? 0 : parsedDelay;

    const unsetValue = () => {
      const doc: Document = getRoot();
      const targetElement: ?Element = doc.getElementById(targetId);
      if (!targetElement) {
        return;
      }

      targetElement.setAttribute('value', '');
      // targetElement.removeAttribute('value');
      const newRoot: Document = shallowCloneToRoot(targetElement);

      // Update the DOM with the new state
      updateRoot(newRoot);
    };

    if (delay === 0) {
      // If there's no delay, unset the target immediately
      unsetValue();
    } else {
      // Wait for the delay then unset the target.
      later(delay).then(unsetValue).catch(unsetValue);
    }
  },
};
