// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentOnUpdate } from 'hyperview/src/types';
import { getBehaviorElements, later } from 'hyperview/src/services';
import { Alert } from 'react-native';

export default {
  action: 'alert',
  callback: (element: Element, onUpdate: HvComponentOnUpdate) => {
    const title = element.getAttributeNS(Namespaces.HYPERVIEW_ALERT, 'title');
    const message = element.getAttributeNS(
      Namespaces.HYPERVIEW_ALERT,
      'message',
    );
    const childNodes = element.childNodes ? Array.from(element.childNodes) : [];

    // Get the immediate alert:option nodes. We don't use getElementsByTagname to
    // avoid getting options for nested alerts.
    const optionElements = childNodes.filter(
      n =>
        n &&
        n.namespaceURI === Namespaces.HYPERVIEW_ALERT &&
        n.localName === 'option',
    );

    // Create the options for the alert.
    // NOTE: Android supports at most 3 options.
    const options = optionElements.map(optionElement => ({
      text:
        optionElement &&
        optionElement.getAttributeNS(Namespaces.HYPERVIEW_ALERT, 'label'),
      onPress: () => {
        getBehaviorElements(optionElement)
          .filter(
            // Only behaviors with "press" trigger will get executed.
            // "press" is also the default trigger, so if no trigger is specified,
            // the behavior will also execute.
            e =>
              !e.getAttribute('trigger') ||
              e.getAttribute('trigger') === 'press',
          )
          .forEach((behaviorElement, i) => {
            const href = behaviorElement.getAttribute('href');
            const action = behaviorElement.getAttribute('action');
            const verb = behaviorElement.getAttribute('verb');
            const targetId = behaviorElement.getAttribute('target');
            const showIndicatorIds = behaviorElement.getAttribute(
              'show-during-load',
            );
            const hideIndicatorIds = behaviorElement.getAttribute(
              'hide-during-load',
            );
            const delay = behaviorElement.getAttribute('delay');
            const once = behaviorElement.getAttribute('once');
            // With multiple behaviors for the same trigger, we need to stagger
            // the updates a bit so that each update operates on the latest DOM.
            // Ideally, we could apply multiple DOM updates at a time.
            later(i).then(
              () =>
                optionElement &&
                onUpdate(href, action, optionElement, {
                  verb,
                  targetId,
                  showIndicatorIds,
                  hideIndicatorIds,
                  delay,
                  once,
                  behaviorElement,
                }),
            );
          });
      },
    }));
    // Show alert
    Alert.alert(title, message, options);
  },
};
