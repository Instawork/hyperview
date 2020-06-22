// @flow

import * as Behaviors from 'hyperview/src/services/behaviors';
import type {
  DOMString,
  Document,
  Element,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
} from 'hyperview/src/types';
import { later, shallowCloneToRoot } from 'hyperview/src/services';
import { splitAttributeList } from 'hyperview/src/services/xml';

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
      console.warn('[behaviors/set-value]: missing "target" attribute');
      return;
    }

    const newValue: string = element.getAttribute('new-value') || '';

    const delayAttr: string = element.getAttribute('delay') || '0';
    const parsedDelay: number = parseInt(delayAttr, 10);
    const delay: number = isNaN(parsedDelay) ? 0 : parsedDelay;

    const showIndicatorIds: Array<string> = splitAttributeList(
      element.getAttribute('show-during-load') || '',
    );
    const hideIndicatorIds: Array<string> = splitAttributeList(
      element.getAttribute('hide-during-load') || '',
    );

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
        newRoot = Behaviors.setIndicatorsAfterLoad(
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
      const newRoot = Behaviors.setIndicatorsBeforeLoad(
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
