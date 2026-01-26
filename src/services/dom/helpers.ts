import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { LOCAL_NAME, NODE_TYPE, UPDATE_ACTIONS } from 'hyperview/src/types';
import type { NamespaceURI, NodeType, UpdateAction } from 'hyperview/src/types';
import { DocumentGetElementByIdError } from './errors';
import { uuid } from 'hyperview/src/services';

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
  localName: string,
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
  localName: string,
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
  doc: Document | undefined,
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
      const behaviorId = behavior.getAttribute('id');
      if (!behaviorId) {
        behavior.setAttribute('id', uuid());
      }
    }
  });
  return doc;
};

/**
 * Find the behavior in the dom by its id and return the target element
 * This is needed in cases where the dom has been mutated and the behavior
 * is no longer a direct child of the view
 */
export const findTargetByBehavior = (
  doc: Document | undefined,
  behaviorElement: Element | null | undefined,
  element: Element | null | undefined,
): Element | null => {
  if (!doc || !behaviorElement) {
    return null;
  }
  const behaviorId = behaviorElement.getAttribute('id');
  const currentBehaviorElement = behaviorId
    ? getElementById(doc, behaviorId)
    : null;

  if (!currentBehaviorElement || !currentBehaviorElement.parentNode) {
    if (element?.parentNode) {
      return element;
    }
    return null;
  }

  // The target is the element itself
  if (currentBehaviorElement.tagName !== LOCAL_NAME.BEHAVIOR) {
    return currentBehaviorElement;
  }

  // The target is the parent of the behavior element
  return currentBehaviorElement.parentNode as Element;
};

// Return a trimmed and cleaned string from a given string starting at character index `start`
// with a total `length`
export const trimAndCleanString = (
  text: string,
  start: number,
  length: number,
): string => {
  const totalLength = text.length;
  const safeStart = Math.max(0, Math.min(start, totalLength));
  const safeEnd = Math.min(totalLength, safeStart + Math.max(0, length));
  const raw = text.slice(safeStart, safeEnd);
  return raw.replace(/\s+/g, ' ').trim();
};

// Find the index of the '>' that ends the first opening tag `<tag ...>`.
// Returns `fallback` (default 0) when not found.
export const findTagEndIndex = (
  xml: string,
  tag: string,
  fallback = 0,
): number => {
  if (!xml || !tag) {
    return fallback;
  }
  const reFull = new RegExp(`<${tag}\\b[^>]*>`, 'i');
  const m = reFull.exec(xml);
  if (m) {
    return m.index + m[0].length - 1;
  }
  return fallback;
};
