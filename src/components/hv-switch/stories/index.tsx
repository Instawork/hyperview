/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Helpers from 'hyperview/storybook/helpers';
import HvSwitch from 'hyperview/src/components/hv-switch';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvSwitch);
createStory('basic', ({ element, stylesheets }) => (
  <HvSwitch
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
