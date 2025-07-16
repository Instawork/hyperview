import * as Namespaces from 'hyperview/src/services/namespaces';
import { DOMParser } from '@instawork/xmldom';

const parser = new DOMParser();

export const getElements = (
  xml: string,
  localName: string,
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
