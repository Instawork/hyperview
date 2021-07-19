// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Components from 'hyperview/src/services/components';
import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import type { Element, HvComponent, LocalName } from 'hyperview/src/types';
import { DOMParser } from 'xmldom-instawork';
import React from 'react';
import { action } from '@storybook/addon-actions';

const parser = new DOMParser();

export const getElements = (
  xml: string,
  localName: LocalName,
  namespaceURI: string = Namespaces.HYPERVIEW,
): Element[] => {
  const document = parser.parseFromString(xml);
  return Array.from(document.getElementsByTagNameNS(namespaceURI, localName));
};

export const getDummyHvProps = () => ({
  onUpdate: () => {},
  options: {},
  stylesheets: {
    focused: [],
    pressed: [],
    pressedSelected: [],
    regular: [],
    selected: [],
  },
});

export const render = (
  Component: HvComponent,
  template: string,
  ComponentsRegistry: ?(HvComponent[]) = null,
): ?HvComponent => {
  const document = parser.parseFromString(template);
  const element = Dom.getFirstTag(
    document,
    Component.localName,
    Component.namespaceURI,
  );
  const stylesheets = Stylesheets.createStylesheets(document);
  if (!element) {
    return null;
  }
  return (
    // $FlowFixMe: HvComponentStatics type mixin causes type inference issues
    <Component
      element={element}
      onUpdate={action('action')}
      options={{
        componentRegistry: Components.getRegistry(
          ComponentsRegistry || [Component],
        ),
      }}
      stylesheets={stylesheets}
    />
  );
};
