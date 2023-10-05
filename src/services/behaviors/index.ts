/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import type { HvComponentOnUpdate, UpdateAction } from 'hyperview/src/types';
import { ACTIONS } from 'hyperview/src/types';
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
    const indicatorElement: Element | null | undefined = newRoot.getElementById(
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
  });
};
