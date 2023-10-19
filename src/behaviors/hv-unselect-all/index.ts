import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Xml from 'hyperview/src/services/xml';
import type {
  DOMString,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
} from 'hyperview/src/types';
import { later, shallowCloneToRoot } from 'hyperview/src/services';
import { ACTIONS } from 'hyperview/src/types';

export default {
  action: ACTIONS.UNSELECT_ALL,
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
      console.warn('[behaviors/unselect-all]: missing "target" attribute');
      return;
    }

    const delayAttr: string = element.getAttribute('delay') || '0';
    const parsedDelay: number = parseInt(delayAttr, 10);
    const delay: number = Number.isNaN(parsedDelay) ? 0 : parsedDelay;

    const showIndicatorIds: Array<string> = Xml.splitAttributeList(
      element.getAttribute('show-during-load') || '',
    );
    const hideIndicatorIds: Array<string> = Xml.splitAttributeList(
      element.getAttribute('hide-during-load') || '',
    );

    const unselectAll = () => {
      const doc: Document | null = getRoot();
      const targetElement: Element | null | undefined = doc
        ? doc.getElementById(targetId)
        : null;
      if (!targetElement) {
        return;
      }

      targetElement.setAttribute('unselect-all', 'true');
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
      // If there's no delay, unselect-all the target immediately without showing/hiding
      // any indicators.
      unselectAll();
    } else {
      // If there's a delay, first trigger the indicators before the unselect-all.
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
      // Wait for the delay then unselect-all the target.
      later(delay).then(unselectAll).catch(unselectAll);
    }
  },
};
