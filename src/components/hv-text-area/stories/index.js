// @flow

import * as Helpers from 'hyperview/storybook/helpers';
import HvTextArea from 'hyperview/src/components/hv-text-area';
import React from 'react';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvTextArea);
createStory('basic', ({ element, stylesheets }) => (
  <HvTextArea
    animations={null}
    element={element}
    onUpdate={action('onUpdate')}
    options={Helpers.getOptions()}
    stylesheets={stylesheets}
  />
));
