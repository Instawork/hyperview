// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as ComponentsInternal from './internal';
import type { ComponentRegistry, HvComponent } from 'hyperview/src/types';
import HvCodeInput from 'hyperview/src/components/hv-code-input';
import HvDateField from 'hyperview/src/components/hv-date-field';
import HvImage from 'hyperview/src/components/hv-image';
import HvList from 'hyperview/src/components/hv-list';
import HvOption from 'hyperview/src/components/hv-option';
import HvPickerField from 'hyperview/src/components/hv-picker-field';
import HvSectionList from 'hyperview/src/components/hv-section-list';
import HvSelectMultiple from 'hyperview/src/components/hv-select-multiple';
import HvSelectSingle from 'hyperview/src/components/hv-select-single';
import HvSpinner from 'hyperview/src/components/hv-spinner';
import HvSwitch from 'hyperview/src/components/hv-switch';
import HvText from 'hyperview/src/components/hv-text';
import HvTextField from 'hyperview/src/components/hv-text-field';
import HvView from 'hyperview/src/components/hv-view';
import HvWebView from 'hyperview/src/components/hv-web-view';

const HYPERVIEW_COMPONENTS = [
  HvCodeInput,
  HvDateField,
  HvList,
  HvOption,
  HvPickerField,
  HvSectionList,
  HvSelectMultiple,
  HvSelectSingle,
  HvSpinner,
  HvSwitch,
  HvText,
  HvTextField,
  HvImage,
  HvView,
  HvWebView,
];

const reducer = (registry: ComponentRegistry, component: HvComponent) => ({
  ...registry,
  [component.namespaceURI]: {
    ...registry[component.namespaceURI],
    ...ComponentsInternal.registerComponent(component),
  },
});

export const getRegistry = (
  components: HvComponent[] = [],
): ComponentRegistry =>
  [...HYPERVIEW_COMPONENTS, ...components].reduce(reducer, {});

export const getFormRegistry = (
  components: HvComponent[] = [],
): ComponentRegistry =>
  [...HYPERVIEW_COMPONENTS, ...components]
    .filter(c => Object.prototype.hasOwnProperty.call(c, 'getFormInputValues'))
    .reduce(reducer, {});
