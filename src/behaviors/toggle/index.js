// @flow

import type {
  DOMString,
  Element,
  Document,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
} from 'hyperview/src/types';
import {
  getBehaviorElements,
  later,
  shallowCloneToRoot,
} from 'hyperview/src/services';

const toggleIndicators = (
  ids: Array<string>,
  showIndicators: boolean,
  root: Document,
): Document => {
  let newRoot = root;
  ids.forEach(id => {
    const indicatorElement: ?Element = root.getElementById(id);
    if (!indicatorElement) {
      return;
    }
    indicatorElement.setAttribute('hide', showIndicators ? 'false' : 'true');
    newRoot = shallowCloneToRoot(indicatorElement);
  });
  return newRoot;
};

const setIndicators = (
  showIndicatorIds: Array<string>,
  hideIndicatorIds: Array<string>,
  set: boolean,
  root: Document,
): Document => {
  let newRoot: Document = root;
  newRoot = toggleIndicators(showIndicatorIds, set, newRoot);
  newRoot = toggleIndicators(hideIndicatorIds, !set, newRoot);
  return newRoot;
};

export default {
  action: 'toggle',
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

    const delayAttr: ?DOMString = element.getAttribute('delay');
    let delay: number = delayAttr ? parseInt(delayAttr) : 0;
    if (isNaN(delay)) {
      delay = 0;
    }

    const showIndicatorIds = (
      element.getAttribute('show-during-load') || ''
    ).split(' ');
    const hideIndicatorIds = (
      element.getAttribute('hide-during-load') || ''
    ).split(' ');

    const toggleElement = () => {
      const doc: Document = getRoot();
      const targetElement: ?Element = doc.getElementById(targetId);
      if (!targetElement) {
        return;
      }

      const isCurrentlyHidden: boolean =
        targetElement.getAttribute('hide') === 'true';
      const newToggleState: string = isCurrentlyHidden ? 'false' : 'true';
      targetElement.setAttribute('hide', newToggleState);
      let newRoot: Document = shallowCloneToRoot(targetElement);
      newRoot = setIndicators(
        showIndicatorIds,
        hideIndicatorIds,
        false,
        newRoot,
      );
      updateRoot(newRoot);
    };

    if (delay === 0) {
      toggleElement();
    } else {
      const newRoot = setIndicators(
        showIndicatorIds,
        hideIndicatorIds,
        true,
        getRoot(),
      );
      updateRoot(newRoot);
      later(delay).then(toggleElement);
    }
  },
};
