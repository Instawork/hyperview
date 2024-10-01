import * as Components from 'hyperview/src/services/components';
import * as Dom from 'hyperview/src/services/dom';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import type { HvComponent, LocalName, StyleSheets } from 'hyperview/src/types';
import { DOMParser } from '@instawork/xmldom';
import humps from 'humps';
import { storiesOf } from '@storybook/react-native';
import templates from 'hyperview/storybook/templates.gen';

const getComponentPath = (componentName: string) => {
  const baseName = humps.decamelize(componentName, { separator: '-' });
  return `hyperview/src/components/${baseName}`;
};

type Render = (options: {
  element: Element;
  stylesheets: StyleSheets;
}) => JSX.Element;

export const stories = (
  Component: HvComponent,
): ((template: string, render?: Render, tagName?: LocalName) => void) => {
  const componentPath = getComponentPath(Component.name);
  const s = storiesOf(Component.name, module);
  return (templateName: string, render?: Render, tagName?: LocalName) => {
    const templatePath = `${componentPath}/stories/${templateName}.xml`;
    const storyName = humps.pascalize(templateName);
    const parser = new DOMParser();
    const document = parser.parseFromString(
      (templates as Record<string, string>)[templatePath],
    );
    const element = Dom.getFirstTag(document, tagName || Component.localName);
    if (!element) {
      throw new Error(`Could not find element with tag name ${tagName}`);
    }
    const stylesheets = Stylesheets.createStylesheets(document);
    s.add(storyName, () => render?.({ element, stylesheets }));
  };
};

export const getOptions = () => ({
  componentRegistry: new Components.Registry([]),
});
