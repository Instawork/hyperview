// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, LocalName } from 'hyperview/src/types';
import { DOMParser } from 'xmldom-instawork';

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
