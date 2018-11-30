// @flow

import * as Helpers from 'hyperview/storybook/helpers';
import HvSelectSingle from 'hyperview/src/components/hv-select-single';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvSelectSingle);
createStory('basic', ({ element, stylesheets }) => (
  <HvSelectSingle
    animations={null}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
