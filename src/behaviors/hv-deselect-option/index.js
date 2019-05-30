import * as Namespaces from 'hyperview/src/services/namespaces';
import type { DOMString, Element } from 'hyperview/src/types';
import { getFirstTag, shallowCloneToRoot } from 'hyperview/src/services';

export default {
  action: 'deselect-option',
  callback: (element: Element, onUpdate, doc) => {
    const targetId: ?DOMString = element.getAttribute('target');
    if (!targetId) {
      return;
    }
    const targetElement = doc.getElementById(targetId);
    if (!targetElement) {
      return;
    }
    targetElement.setAttribute('selected', false);
    return shallowCloneToRoot(targetElement);
  },
};
