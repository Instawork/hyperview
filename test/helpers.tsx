import * as Components from 'hyperview/src/services/components';
import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import type { HvComponent, LocalName } from 'hyperview/src/types';
import { DOMParser } from '@instawork/xmldom';
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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

export const parse = (template: string) => parser.parseFromString(template);

export const render = (
  Component: HvComponent,
  template: string,
  ComponentsRegistry: HvComponent[] | null = null,
): JSX.Element | null => {
  const document = parse(template);
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
