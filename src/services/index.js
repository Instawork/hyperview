// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  Document,
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  LocalName,
  StyleSheets,
} from 'hyperview/src/types';
import type { ComponentType } from 'react';
import HyperRef from 'hyperview/src/components/hyper-ref';
import React from 'react';

/**
 * This file is currently a dumping place for every functions used accross
 * various Hyperview components.
 */

export const getBehaviorElements = (element: any) => {
  const behaviorElements = Array.from(element.childNodes).filter(
    n => n.tagName === 'behavior',
  );

  if (element.getAttribute('href')) {
    behaviorElements.unshift(element);
  }

  return behaviorElements;
};

export const getFirstTag = (document: Document, localName: LocalName) => {
  const elements = document.getElementsByTagNameNS(
    Namespaces.HYPERVIEW,
    localName,
  );
  if (elements && elements[0]) {
    return elements[0];
  }
  return null;
};

export const createProps = (
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
) => {
  const numericRules = ['numberOfLines'];
  const booleanRules = ['multiline'];

  const props = {};
  if (!element.attributes) {
    return props;
  }
  for (let i = 0; i < element.attributes.length; i += 1) {
    const attr = element.attributes.item(i);
    if (attr) {
      if (numericRules.indexOf(attr.name) >= 0) {
        const intValue = parseInt(attr.value, 10);
        props[attr.name] = intValue || 0;
      } else if (booleanRules.indexOf(attr.name) >= 0) {
        props[attr.name] = attr.value === 'true';
      } else {
        props[attr.name] = attr.value;

        // Add the id attribute as a test id
        // (for testing automation purposes).
        if (attr.name === 'id') {
          props.testId = attr.value;
        }
      }
    }
  }
  if (props.style) {
    const styleIds = props.style.split(' ');
    let styleRules = styleIds.map(s => stylesheets.regular[s]);

    if (options.pressed) {
      let pressedRules = styleIds
        .map(s => stylesheets.pressed[s])
        .filter(r => !!r);
      if (pressedRules.length === 0) {
        pressedRules = [{ opacity: 0.7 }];
      }
      styleRules = styleRules.concat(pressedRules);
    }

    if (options.focused) {
      const focusedRules = styleIds
        .map(s => stylesheets.focused[s])
        .filter(r => !!r);
      styleRules = styleRules.concat(focusedRules);
    }

    if (options.selected) {
      const selectedRules = styleIds
        .map(s => stylesheets.selected[s])
        .filter(r => !!r);
      styleRules = styleRules.concat(selectedRules);
    }

    if (options.pressedSelected) {
      const pressedSelectedRules = styleIds
        .map(s => stylesheets.pressedSelected[s])
        .filter(r => !!r);
      styleRules = styleRules.concat(pressedSelectedRules);
    }

    props.style = styleRules;
  }

  return props;
};

export const later = (delayMs: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, delayMs));

const getChildElementsByTagName = (element: Element, tagName: string) =>
  Array.from(element.childNodes).filter(
    n => n.nodeType === 1 && n.tagName === tagName,
  );

export const addHref = (
  component: ComponentType,
  element: Element,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
) => {
  const href = element.getAttribute('href');
  const behaviorElements = getChildElementsByTagName(element, 'behavior');
  const hasBehaviors = href || behaviorElements.length > 0;
  if (!hasBehaviors) {
    return component;
  }

  return React.createElement(
    HyperRef,
    { element, stylesheets, onUpdate, options },
    ...Render.renderChildren(element, stylesheets, onUpdate, options),
  );
};
