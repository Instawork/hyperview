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
import {
  setIndicatorsAfterLoad,
  setIndicatorsBeforeLoad,
} from 'hyperview/src/services/behaviors';

export default {
  action: 'set-value',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {
    const targetId: ?DOMString = element.getAttribute('target');
    if (!targetId) {
      return;
    }

    const newValue: string = element.getAttribute('value') || '';

    const delayAttr: string = element.getAttribute('delay') || '0';
    const parsedDelay: number = parseInt(delayAttr, 10);
    const delay: number = isNaN(parsedDelay) ? 0 : parsedDelay;

    const showIndicatorIds: Array<string> = (
      element.getAttribute('show-during-load') || ''
    ).split(' ');
    const hideIndicatorIds: Array<string> = (
      element.getAttribute('hide-during-load') || ''
    ).split(' ');

    const setValue = () => {
      const doc: Document = getRoot();
      const targetElement: ?Element = doc.getElementById(targetId);
      if (!targetElement) {
        return;
      }

      // Show the target
      targetElement.setAttribute('value', newValue);
      let newRoot: Document = shallowCloneToRoot(targetElement);

      // If using delay, we need to undo the indicators shown earlier.
      if (delay > 0) {
        newRoot = setIndicatorsAfterLoad(
          showIndicatorIds,
          hideIndicatorIds,
          newRoot,
        );
      }
      // Update the DOM with the new shown state and finished indicators.
      updateRoot(newRoot);
    };

    if (delay === 0) {
      // If there's no delay, show target immediately without showing/hiding
      // any indicators.
      setValue();
    } else {
      // If there's a delay, first trigger the indicators before the show.
      const newRoot = setIndicatorsBeforeLoad(
        showIndicatorIds,
        hideIndicatorIds,
        getRoot(),
      );
      // Update the DOM to reflect the new state of the indicators.
      updateRoot(newRoot);
      // Wait for the delay then show the target.
      later(delay)
        .then(setValue)
        .catch(setValue);
    }
  },
};
