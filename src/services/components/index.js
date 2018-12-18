// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ComponentRegistry, HvComponent } from 'hyperview/src/types';
import HvList from 'hyperview/src/components/hv-list';
import HvOption from 'hyperview/src/components/hv-option';
import HvSectionList from 'hyperview/src/components/hv-section-list';
import HvSelectMultiple from 'hyperview/src/components/hv-select-multiple';
import HvSelectSingle from 'hyperview/src/components/hv-select-single';
import HvSpinner from 'hyperview/src/components/hv-spinner';
import HvTextArea from 'hyperview/src/components/hv-text-area';
import HvTextField from 'hyperview/src/components/hv-text-field';

const HYPERVIEW_COMPONENTS = [
  HvList,
  HvOption,
  HvSectionList,
  HvSelectMultiple,
  HvSelectSingle,
  HvSpinner,
  HvTextArea,
  HvTextField,
];

export const getRegistry = (
  components: HvComponent<*>[] = [],
): ComponentRegistry =>
  [...HYPERVIEW_COMPONENTS, ...components].reduce(
    (registry, component) => ({
      ...registry,
      [component.namespaceURI]: {
        ...registry[component.namespaceURI],
        [component.localName]: component,
      },
    }),
    {},
  );
