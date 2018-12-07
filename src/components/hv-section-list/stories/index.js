/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as Helpers from 'hyperview/storybook/helpers';
import HvSectionList from 'hyperview/src/components/hv-section-list';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvSectionList);
createStory('basic', ({ element, stylesheets }) => (
  <HvSectionList
    animations={null}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
createStory('infinite_scroll', ({ element, stylesheets }) => (
  <HvSectionList
    animations={null}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
