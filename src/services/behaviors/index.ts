import * as Dom from 'hyperview/src/services/dom';
import * as Logging from 'hyperview/src/services/logging';
import {
  ACTIONS,
  BEHAVIOR_ATTRIBUTES,
  NAV_ACTIONS,
  UPDATE_ACTIONS,
} from 'hyperview/src/types';
import type {
  HvComponentOnUpdate,
  NavAction,
  UpdateAction,
} from 'hyperview/src/types';
import { XMLSerializer } from '@instawork/xmldom';
import { shallowCloneToRoot } from 'hyperview/src/services';

/**
 * The elements in the Document with the given ids will be set to
 * visible or hidden based on showIndicators.
 * Returns a new Document object with the toggled indicators.
 */
export const toggleIndicators = (
  ids: Array<string>,
  showIndicators: boolean,
  root: Document,
): Document =>
  ids.reduce((newRoot, id) => {
    const indicatorElement: Element | null | undefined = Dom.getElementById(
      newRoot,
      id,
    );
    if (!indicatorElement) {
      return newRoot;
    }
    indicatorElement.setAttribute('hide', showIndicators ? 'false' : 'true');
    return shallowCloneToRoot(indicatorElement);
  }, root);

/**
 * Returns a new Document object that shows the "show" indicators
 * and hides the "hide" indicators.
 */
export const setIndicatorsBeforeLoad = (
  showIndicatorIds: Array<string>,
  hideIndicatorIds: Array<string>,
  root: Document,
): Document => {
  let newRoot: Document = root;
  newRoot = toggleIndicators(showIndicatorIds, true, newRoot);
  newRoot = toggleIndicators(hideIndicatorIds, false, newRoot);
  return newRoot;
};

/**
 * Returns a new Document object that hides the "show" indicators
 * and shows the "hide" indicators.
 */
export const setIndicatorsAfterLoad = (
  showIndicatorIds: Array<string>,
  hideIndicatorIds: Array<string>,
  root: Document,
): Document => {
  let newRoot: Document = root;
  newRoot = toggleIndicators(showIndicatorIds, false, newRoot);
  newRoot = toggleIndicators(hideIndicatorIds, true, newRoot);
  return newRoot;
};

/**
 * Returns a new Document object where the given action was applied to the target element
 * with the new element.
 */
export const performUpdate = (
  action: UpdateAction,
  targetElement: Element,
  newElement: Element,
): Document => {
  if (action === ACTIONS.REPLACE) {
    const { parentNode } = targetElement;
    if (parentNode) {
      parentNode.replaceChild(newElement, targetElement);
      return shallowCloneToRoot(parentNode as Element);
    }
  }

  if (action === ACTIONS.REPLACE_INNER) {
    let child: Node | null | undefined = targetElement.firstChild;
    // Remove the target's children
    while (child !== null && child !== undefined) {
      const nextChild: Node | null | undefined = child.nextSibling;
      targetElement.removeChild(child);
      child = nextChild;
    }
    targetElement.appendChild(newElement);
    return shallowCloneToRoot(targetElement);
  }

  if (action === ACTIONS.APPEND) {
    targetElement.appendChild(newElement);
    return shallowCloneToRoot(targetElement);
  }

  if (action === ACTIONS.PREPEND) {
    const { firstChild } = targetElement;
    if (firstChild) {
      targetElement.insertBefore(newElement, firstChild);
    } else {
      targetElement.appendChild(newElement);
    }
    return shallowCloneToRoot(targetElement);
  }

  return shallowCloneToRoot(targetElement);
};

const logBehavior = (behaviorElement: Element, action: string | null) => {
  Logging.info(
    `[behavior] | action: ${action} |`,
    Logging.deferredToString(() => {
      return new XMLSerializer().serializeToString(behaviorElement);
    }),
  );
};

/**
 * Trigger all behaviors matching the given name
 */
export const trigger = (
  name: string,
  element: Element,
  onUpdate: HvComponentOnUpdate,
) => {
  const behaviorElements = Dom.getBehaviorElements(element);
  const matchingBehaviors = behaviorElements.filter(
    e => e.getAttribute('trigger') === name,
  );
  matchingBehaviors.forEach(behaviorElement => {
    const href = behaviorElement.getAttribute('href');
    const action = behaviorElement.getAttribute('action');
    const verb = behaviorElement.getAttribute('verb');
    const targetId = behaviorElement.getAttribute('target');
    const showIndicatorIds = behaviorElement.getAttribute('show-during-load');
    const hideIndicatorIds = behaviorElement.getAttribute('hide-during-load');
    const delay = behaviorElement.getAttribute('delay');
    const once = behaviorElement.getAttribute('once');
    onUpdate(href, action, element, {
      behaviorElement,
      delay,
      hideIndicatorIds,
      once,
      showIndicatorIds,
      targetId,
      verb,
    });
    logBehavior(behaviorElement, action);
  });
};

/**
 * Trigger a set of pre-filtered behaviors
 */
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
      logBehavior(behaviorElement, action);
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
      logBehavior(behaviorElement, action);
    };
  }
  // Custom behavior
  return (element: Element) => {
    onUpdate(null, action, element, { behaviorElement, custom: true });
    logBehavior(behaviorElement, action);
  };
};

/**
 * Set the `ran-once` attribute to true.
 */
export const setRanOnce = (behaviorElement: Element) => {
  behaviorElement.setAttribute('ran-once', 'true');
};

/**
 * Checks if `once` is previously applied.
 */
export const isOncePreviouslyApplied = (behaviorElement: Element): boolean => {
  const once = behaviorElement.getAttribute('once');
  const ranOnce = behaviorElement.getAttribute('ran-once');
  return once === 'true' && ranOnce === 'true';
};
