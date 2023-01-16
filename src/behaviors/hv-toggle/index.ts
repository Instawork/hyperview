import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Xml from 'hyperview/src/services/xml';
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
  action: 'toggle',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {
    const targetId: DOMString | null | undefined = element.getAttribute('target');
    if (!targetId) {
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

    const toggleElement = () => {
      const doc: Document = getRoot();
      const targetElement: Element | null | undefined = doc.getElementById(targetId);
      if (!targetElement) {
        return;
      }

      // Toggle the hide attribute of the target
      const isCurrentlyHidden: boolean =
        targetElement.getAttribute('hide') === 'true';
      const newToggleState: string = isCurrentlyHidden ? 'false' : 'true';
      targetElement.setAttribute('hide', newToggleState);
      let newRoot: Document = shallowCloneToRoot(targetElement);

      // If using the delay, we need to undo the indicators shown earlier.
      if (delay > 0) {
        newRoot = Behaviors.setIndicatorsAfterLoad(
          showIndicatorIds,
          hideIndicatorIds,
          newRoot,
        );
      }
      // Update the DOM with the new toggle state and finished indicators.
      updateRoot(newRoot);
    };

    if (delay === 0) {
      // If there's no delay, toggle immediately without showing/hiding
      // any indicators.
      toggleElement();
    } else {
      // If there's a delay, first trigger the indicators before the toggle.
      const newRoot = Behaviors.setIndicatorsBeforeLoad(
        showIndicatorIds,
        hideIndicatorIds,
        getRoot(),
      );
      // Update the DOM to reflect the new state of the indicators.
      updateRoot(newRoot);
      // Wait for the delay then toggle the target.
      later(delay).then(toggleElement).catch(toggleElement);
    }
  },
};
