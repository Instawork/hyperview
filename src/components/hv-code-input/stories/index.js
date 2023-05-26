// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Helpers from 'hyperview/storybook/helpers';
import HvCodeInput from 'hyperview/src/components/hv-code-input';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvCodeInput);
createStory('basic', ({ element, stylesheets }) => (
  <HvCodeInput
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
