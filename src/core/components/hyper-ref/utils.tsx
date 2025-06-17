import {
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import HyperRef from './hyper-ref';
import React from 'react';

export const addHref = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any,
  element: Element,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
) => {
  const href = element.getAttribute('href');
  const action = element.getAttribute('action');
  const childNodes = element.childNodes ? Array.from(element.childNodes) : [];
  const behaviorElements = childNodes.filter(
    n => n && n.nodeType === 1 && (n as Element).tagName === 'behavior',
  );
  const hasBehaviors = href || action || behaviorElements.length > 0;
  if (!hasBehaviors) {
    return component;
  }

  return (
    <HyperRef
      element={element}
      onUpdate={onUpdate}
      options={options}
      stylesheets={stylesheets}
    />
  );
};
