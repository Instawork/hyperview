// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Helpers from 'hyperview/storybook/helpers';
import HvView from 'hyperview/src/components/hv-view';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvView);
createStory('basic', ({ element, stylesheets }) => (
  <HvView
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
createStory('scrollview', ({ element, stylesheets }) => (
  <HvView
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
