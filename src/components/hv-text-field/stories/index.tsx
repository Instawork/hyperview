import * as Helpers from 'hyperview/storybook/helpers';
import HvTextField from 'hyperview/src/components/hv-text-field';
import React from 'react';
import type { StyleSheets } from 'hyperview/src/services/stylesheets';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvTextField);
createStory(
  'basic',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvTextField
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);
