// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  Document,
  Element,
  HvComponentOnUpdate,
  LocalName,
  NamespaceURI,
} from 'hyperview/src/types';

export const getBehaviorElements = (element: any) => {
  // $FlowFixMe
  const behaviorElements = Array.from(element.childNodes).filter(
    n => n.tagName === 'behavior',
  );

  if (element.getAttribute('href') || element.getAttribute('action')) {
    behaviorElements.unshift(element);
  }

  return behaviorElements;
};

export const getBehaviorSource = (element) => {
  if (element.tagName === 'behavior') {
    if (!element.parentNode) {
      console.log('no parent!');
    }
    return element.parentNode;
  }
  return element;
};

export const getFirstTag = (
  document: Document,
  localName: LocalName,
  namespace: NamespaceURI = Namespaces.HYPERVIEW,
) => {
  const elements = document.getElementsByTagNameNS(namespace, localName);
  if (elements && elements[0]) {
    return elements[0];
  }
  return null;
};

export const triggerBehaviors = (
  targetElement: Element,
  triggerName: string,
  onUpdate: HvComponentOnUpdate,
) => {
  /*
  Triggers all events in `targetElement` with trigger `triggerName`
  */
  const behaviorElements = getBehaviorElements(targetElement);
  const matchingBehaviors = behaviorElements.filter(
    e => e.getAttribute('trigger') === triggerName,
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

    onUpdate(href, action, targetElement, {
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
