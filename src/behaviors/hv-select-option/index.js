import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  Document,
  Element,
  HvComponentOnUpdate,
} from 'hyperview/src/types';
import { getFirstTag, shallowCloneToRoot } from 'hyperview/src/services';

export default {
  action: 'select-option',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    doc: Document,
  ): Element => {
    const targetId: ?DOMString = element.getAttribute('target');
    if (!targetId) {
      return;
    }
    const targetElement = doc.getElementById(targetId);
    if (!targetElement) {
      return;
    }
    targetElement.setAttribute('selected', true);
    return shallowCloneToRoot(targetElement);
  },
};
