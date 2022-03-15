// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Helpers from 'hyperview/storybook/helpers';
import HvTextField from 'hyperview/src/components/hv-text-field';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvTextField);
createStory('basic', ({ element, stylesheets }) => (
  <HvTextField
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
createStory(
  'text-area',
  ({ element, stylesheets }) => (
    <HvTextField
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
  LOCAL_NAME.TEXT_AREA,
);
