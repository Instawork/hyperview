/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Xml from 'hyperview/src/services/xml';
import type {
  DOMString,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
} from 'hyperview/src/types';
import { later, shallowCloneToRoot } from 'hyperview/src/services';

export default {
  action: 'set-value',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {
    const targetId: DOMString | null | undefined = element.getAttribute(
      'target',
    );
    if (!targetId) {
      console.warn('[behaviors/set-value]: missing "target" attribute');
      return;
    }

    const newValue: string = element.getAttribute('new-value') || '';

    const delayAttr: string = element.getAttribute('delay') || '0';
    const parsedDelay: number = parseInt(delayAttr, 10);
    const delay: number = Number.isNaN(parsedDelay) ? 0 : parsedDelay;

    const showIndicatorIds: Array<string> = Xml.splitAttributeList(
      element.getAttribute('show-during-load') || '',
    );
    const hideIndicatorIds: Array<string> = Xml.splitAttributeList(
      element.getAttribute('hide-during-load') || '',
    );

    const setValue = () => {
      const doc: Document | null = getRoot();
      const targetElement: Element | null | undefined = doc?.getElementById(
        targetId,
      );
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
      const doc: Document | null = getRoot();
      if (doc) {
        const newRoot = Behaviors.setIndicatorsBeforeLoad(
          showIndicatorIds,
          hideIndicatorIds,
          doc,
        );
        // Update the DOM to reflect the new state of the indicators.
        updateRoot(newRoot);
      }
      // Wait for the delay then show the target.
      later(delay).then(setValue).catch(setValue);
    }
  },
};
