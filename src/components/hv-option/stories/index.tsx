/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Helpers from 'hyperview/storybook/helpers';
import HvOption from 'hyperview/src/components/hv-option';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvOption);
createStory('basic', ({ element, stylesheets }) => (
  <HvOption
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
createStory('pre_selected', ({ element, stylesheets }) => (
  <HvOption
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));

createStory('custom', ({ element, stylesheets }) => (
  <HvOption
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
