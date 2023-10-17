/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ACTIONS,
  BEHAVIOR_ATTRIBUTES,
  HvComponentOnUpdate,
  NAV_ACTIONS,
  NavAction,
  UPDATE_ACTIONS,
  UpdateAction,
} from 'hyperview/src/types';

export const triggerBehaviors = (
  element: Element,
  behaviors: Element[],
  onUpdate: HvComponentOnUpdate,
) => {
  behaviors.forEach(behaviorElement => {
    const handler = createActionHandler(behaviorElement, onUpdate);
    if (
      behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.IMMEDIATE) === 'true'
    ) {
      handler(element);
    } else {
      setTimeout(() => handler(element), 0);
    }
  });
};

export const createActionHandler = (
  behaviorElement: Element,
  onUpdate: HvComponentOnUpdate,
) => {
  const action =
    behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.ACTION) ||
    NAV_ACTIONS.PUSH;
  if (Object.values(NAV_ACTIONS).indexOf(action as NavAction) >= 0) {
    return (element: Element) => {
      const href = behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.HREF);
      const targetId = behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.TARGET);
      const showIndicatorId = behaviorElement.getAttribute(
        BEHAVIOR_ATTRIBUTES.SHOW_DURING_LOAD,
      );
      const delay = behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.DELAY);
      onUpdate(href, action, element, { delay, showIndicatorId, targetId });
    };
  }
  if (
    action === ACTIONS.RELOAD ||
    Object.values(UPDATE_ACTIONS).indexOf(action as UpdateAction) >= 0
  ) {
    return (element: Element) => {
      const href = behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.HREF);
      const verb = behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.VERB);
      const targetId = behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.TARGET);
      const showIndicatorIds = behaviorElement.getAttribute(
        BEHAVIOR_ATTRIBUTES.SHOW_DURING_LOAD,
      );
      const hideIndicatorIds = behaviorElement.getAttribute(
        BEHAVIOR_ATTRIBUTES.HIDE_DURING_LOAD,
      );
      const delay = behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.DELAY);
      const once = behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.ONCE);
      onUpdate(href, action, element, {
        behaviorElement,
        delay,
        hideIndicatorIds,
        once,
        showIndicatorIds,
        targetId,
        verb,
      });
    };
  }
  // Custom behavior
  return (element: Element) =>
    onUpdate(null, action, element, { behaviorElement, custom: true });
};
