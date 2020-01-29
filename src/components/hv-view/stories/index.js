// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Helpers from 'hyperview/storybook/helpers';
import * as ScrollContext from 'hyperview/src/services/scroll-context';
import HvView from 'hyperview/src/components/hv-view';
import React from 'react';
import { action } from '@storybook/addon-actions';

const HvViewWithScrollContext = ScrollContext.withProvider(HvView);

const createStory = Helpers.stories(HvView);
createStory('basic', ({ element, stylesheets }) => (
  <HvViewWithScrollContext
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
createStory('scrollview', ({ element, stylesheets }) => (
  <HvViewWithScrollContext
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
