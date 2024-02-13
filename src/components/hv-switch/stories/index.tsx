import * as Helpers from 'hyperview/storybook/helpers';
import HvSwitch from 'hyperview/src/components/hv-switch';
import React from 'react';
import type { StyleSheets } from 'hyperview/src/services/stylesheets';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvSwitch);
createStory(
  'basic',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvSwitch
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);
