import {
  LOCAL_NAME,
  LocalName,
  Document,
  Element,
  Node,
} from 'hyperview/src/types';
import { getFirstTag } from 'hyperview/src/services/dom/helpers';

export const getRootNode = (
  doc: Document,
  localName: LocalName = LOCAL_NAME.DOC,
): Node => {
  const docElement: Element = getFirstTag(doc, LOCAL_NAME.DOC);
  if (!docElement) {
    throw new Errors.XMLRequiredElementNotFound(LOCAL_NAME.DOC);
  }
  return getFirstchild(docElement);
};

export const getFirstchild = (node: Node): Node => {
  var child: Node = node.firstChild;
  while (child.nodeType != 1) {
    child = child.nextSibling;
  }
  return child;
};

export const getInitialNavRouteNode = (doc: Document): Node => {
  let firstNavChild: Node = null;
  let initialChild: Node = null;
  const elements: Element[] = getChildElements(doc);
  for (let i: Number = 0; i < elements.length; i++) {
    const node: Node = elements[i];
    if (
      node.nodeName === LOCAL_NAME.NAVIGATOR ||
      node.nodeName === LOCAL_NAME.NAV_ROUTE
    ) {
      if (
        !initialChild &&
        node.getAttribute('initial')?.toLowerCase() === 'true'
      ) {
        initialChild = node;
      }
      if (!initialChild && !firstNavChild) {
        firstNavChild = node;
      }
    }

    if (initialChild) {
      break;
    }
  }
  return initialChild || firstNavChild;
};

export const getChildElements = (doc: Document): Element[] => {
  const elements: Element[] = [];
  for (let i: Number = 0; i < doc.childNodes.length; i++) {
    const node: Node = doc.childNodes[i];
    if (node.nodeType !== 1) {
      continue;
    }
    elements.push(node);
  }
  return elements;
};

export const getProp = (
  props: Object,
  name: String,
  context: Object = null,
): String => {
  if (props[name]) {
    return props[name];
  }
  if (props.route && props.route.params && props.route.params[name]) {
    return props.route.params[name];
  }
  if (context && context[name]) {
    return context[name];
  }
  return null;
};
