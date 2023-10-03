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
  action: ACTIONS.SELECT_ALL,
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
      console.warn('[behaviors/select-all]: missing "target" attribute');
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

    const selectAll = () => {
      const doc: Document = getRoot();
      const targetElement: Element | null | undefined = doc.getElementById(
        targetId,
      );
      if (!targetElement) {
        return;
      }

      targetElement.setAttribute('select-all', 'true');
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
      // If there's no delay, select-all the target immediately without showing/hiding
      // any indicators.
      selectAll();
    } else {
      // If there's a delay, first trigger the indicators before the select-all.
      const newRoot = Behaviors.setIndicatorsBeforeLoad(
        showIndicatorIds,
        hideIndicatorIds,
        getRoot(),
      );
      // Update the DOM to reflect the new state of the indicators.
      updateRoot(newRoot);
      // Wait for the delay then select-all the target.
      later(delay).then(selectAll).catch(selectAll);
    }
  },
};
