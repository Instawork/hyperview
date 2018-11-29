// @flow

import * as Helpers from 'hyperview/storybook/helpers';
import HvList from 'hyperview/src/components/hv-list';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvList);
createStory('basic', ({ element, stylesheets }) => (
  <HvList
    animations={[]}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
createStory('infinite_scroll', ({ element, stylesheets }) => (
  <HvList
    animations={[]}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
