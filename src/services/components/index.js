// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ComponentRegistry, HvComponent } from 'hyperview/src/types';
import HvDateField from 'hyperview/src/components/hv-date-field';
import HvImage from 'hyperview/src/components/hv-image';
import HvList from 'hyperview/src/components/hv-list';
import HvOption from 'hyperview/src/components/hv-option';
import HvPickerField from 'hyperview/src/components/hv-picker-field';
import HvSectionList from 'hyperview/src/components/hv-section-list';
import HvSelectMultiple from 'hyperview/src/components/hv-select-multiple';
import HvSelectSingle from 'hyperview/src/components/hv-select-single';
import HvSpinner from 'hyperview/src/components/hv-spinner';
import HvTextArea from 'hyperview/src/components/hv-text-area';
import HvTextField from 'hyperview/src/components/hv-text-field';
import HvWebView from 'hyperview/src/components/hv-web-view';

const HYPERVIEW_COMPONENTS = [
  HvDateField,
  HvList,
  HvOption,
  HvPickerField,
  HvSectionList,
  HvSelectMultiple,
  HvSelectSingle,
  HvSpinner,
  HvTextArea,
  HvTextField,
  HvImage,
  HvWebView,
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
