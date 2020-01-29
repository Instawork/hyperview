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
import HvList from 'hyperview/src/components/hv-list';
import React from 'react';
import { action } from '@storybook/addon-actions';

const HvListWithScrollContext = ScrollContext.withProvider(HvList);

const createStory = Helpers.stories(HvList);
createStory('basic', ({ element, stylesheets }) => (
  <HvListWithScrollContext
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
createStory('infinite_scroll', ({ element, stylesheets }) => (
  <HvListWithScrollContext
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
