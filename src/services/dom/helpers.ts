import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  LocalName,
  NamespaceURI,
  NodeType,
  UpdateAction,
} from 'hyperview/src/types';
import { DocumentGetElementByIdError } from './errors';
import { NODE_TYPE, UPDATE_ACTIONS } from 'hyperview/src/types';

export const getBehaviorElements = (element: Element) => {
  const behaviorElements = Array.from(
    element.childNodes as NodeListOf<Element>,
  ).filter(n => n.tagName === 'behavior');

  if (element.getAttribute('href') || element.getAttribute('action')) {
    behaviorElements.unshift(element);
  }

  return behaviorElements;
};

export const getFirstTag = (
  document: Document | Element,
  localName: LocalName,
  namespace: NamespaceURI = Namespaces.HYPERVIEW,
) => {
  const elements = document.getElementsByTagNameNS(namespace, localName);
  if (elements && elements[0]) {
    return elements[0];
  }
  return null;
};

/**
 * Find the first child element of a node with a given local name and namespace
 */
export const getFirstChildTag = (
  node: Node,
  localName: LocalName,
  namespace: NamespaceURI = Namespaces.HYPERVIEW,
): Element | null => {
  if (!node || !node.childNodes) {
    return null;
  }
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const child = node.childNodes[i] as Element;
    if (
      child.nodeType === NODE_TYPE.ELEMENT_NODE &&
      child.localName === localName &&
      child.namespaceURI === namespace
    ) {
      return child;
    }
  }
  return null;
};

export const getPreviousNodeOfType = (
  node: Node | null,
  type: NodeType,
): Node | null => {
  if (!node || !node.previousSibling) {
    return null;
  }
  if (node.previousSibling?.nodeType === type) {
    return node.previousSibling;
  }
  return getPreviousNodeOfType(node.previousSibling, type);
};

/**
 * N-ary Tree Preorder Traversal
 */
export const preorder = (
  root: Node,
  type: NodeType,
  acc: Node[] = [],
): Node[] => {
  if (root.childNodes) {
    Array.from(root.childNodes).forEach((node: Node | null) => {
      if (node) {
        preorder(node, type, acc);
      }
    });
  } else if (root.nodeType === type) {
    acc.push(root);
  }
  return acc;
};

/**
 * Attempt to find an element by id in the given node
 * Handle cases where an element is passed in instead of a document
 */
export const getElementById = (
  doc: Document | null | undefined,
  id: string,
): Element | null | undefined => {
  if (!doc) {
    return doc;
  }

  try {
    if (isDoc(doc)) {
      return doc.getElementById(id);
    }
    const element = doc as Element;
    return element.ownerDocument
      ? element.ownerDocument.getElementById(id)
      : null;
  } catch (e) {
    Logging.error(new DocumentGetElementByIdError(id, doc, e as Error));
    return null;
  }
};

function isDoc(object: Element | Document): object is Element | Document {
  return 'getElementById' in object;
}

/**
 * Process the incoming doc before it is added to state
 * - Ensure all behaviors with an update action have an id to allow for targeting
 */
export const processDocument = (doc: Document): Document => {
  const behaviors = Array.from(doc.getElementsByTagName('behavior'));
  behaviors.forEach(behavior => {
    const action = behavior.getAttribute('action');
    const updateAction: UpdateAction = action as UpdateAction;
    if (updateAction && Object.values(UPDATE_ACTIONS).includes(updateAction)) {
      const target = behavior.getAttribute('target');
      if (!target) {
        const behaviorId = behavior.getAttribute('id');
        if (!behaviorId) {
          behavior.setAttribute('id', Math.random().toString(36).substring(7));
        }
      }
    }
  });
  return doc;
};
