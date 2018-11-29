// @flow

import * as Helpers from 'hyperview/storybook/helpers';
import HvSpinner from 'hyperview/src/components/hv-spinner';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvSpinner);
createStory('basic', ({ element, stylesheets }) => (
  <HvSpinner
    animations={null}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
createStory('colored', ({ element, stylesheets }) => (
  <HvSpinner
    animations={null}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
