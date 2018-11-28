// @flow

import * as Helpers from 'hyperview/storybook/helpers';
import HvSelectMultiple from 'hyperview/src/components/hv-select-multiple';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvSelectMultiple);
createStory('basic', ({ element, stylesheets }) => (
  <HvSelectMultiple
    animations={[]}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
