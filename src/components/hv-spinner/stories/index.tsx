import * as Helpers from 'hyperview/storybook/helpers';
import HvSpinner from 'hyperview/src/components/hv-spinner';
import React from 'react';
import type { StyleSheets } from 'hyperview/src/services/stylesheets';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvSpinner);
createStory(
  'basic',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvSpinner
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);
createStory(
  'colored',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvSpinner
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);
