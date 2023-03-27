import * as Components from 'hyperview/src/services/components';
import * as Dom from 'hyperview/src/services/dom';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import { DOMParser } from 'xmldom-instawork';
import type { HvComponent, LocalName } from 'hyperview/src/types';
import humps from 'humps';
import { storiesOf } from '@storybook/react-native';
import templates from 'hyperview/storybook/templates.gen';
import type { Element, StyleSheets } from 'hyperview/src/types';

const getComponentPath = (componentName: string) => {
  const baseName = humps.decamelize(componentName, { separator: '-' });
  return `hyperview/src/components/${baseName}`;
};

export const stories = (Component: HvComponent) => {
  const componentPath = getComponentPath(Component.name);
  const s = storiesOf(Component.name, module);
  return (
    templateName: string,
    render: ({
      element,
      stylesheets,
    }: {
      element: Element;
      stylesheets: StyleSheets;
    }) => void,
    tagName?: LocalName,
  ) => {
    const templatePath = `${componentPath}/stories/${templateName}.xml` as keyof typeof templates;
    const storyName = humps.pascalize(templateName);
    const parser = new DOMParser();
    const document = parser.parseFromString(templates[templatePath]);
    const element = Dom.getFirstTag(
      document,
      tagName || Component.localName,
    ) as Element;
    const stylesheets = Stylesheets.createStylesheets(document);
    s.add(storyName, () => render({ element, stylesheets }));
  };
};

export const getOptions = () => ({
  componentRegistry: Components.getRegistry(),
});
