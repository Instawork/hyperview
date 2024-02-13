import * as Helpers from 'hyperview/storybook/helpers';
import HvOption from 'hyperview/src/components/hv-option';
import React from 'react';
import type { StyleSheets } from 'hyperview/src/services/stylesheets';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvOption);
createStory(
  'basic',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvOption
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);
createStory(
  'pre_selected',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvOption
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);

createStory(
  'custom',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvOption
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);
