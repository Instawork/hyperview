import type { HvComponent, HvComponentOptions } from 'hyperview/src/types';

/**
 * Determines if the element needs a hyper-ref component
 * @param element - The element to check
 * @returns True if the element needs a hyper-ref component, false otherwise
 */
export const needsHyperRef = (
  Component: HvComponent,
  element: Element,
  options: HvComponentOptions,
) => {
  if (options.skipHref) {
    return false;
  }
  if (!Component.supportsHyperRef) {
    return false;
  }
  const href = element.getAttribute('href');
  const action = element.getAttribute('action');
  const childNodes = element.childNodes ? Array.from(element.childNodes) : [];
  const behaviorElements = childNodes.filter(
    n => n && n.nodeType === 1 && (n as Element).tagName === 'behavior',
  );
  return href || action || behaviorElements.length > 0;
};
