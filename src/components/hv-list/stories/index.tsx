import * as Helpers from 'hyperview/storybook/helpers';
import HvList from 'hyperview/src/components/hv-list';
import React from 'react';
import type { StyleSheets } from 'hyperview/src/services/stylesheets';
import { action } from '@storybook/addon-actions';

const createStory = Helpers.stories(HvList);
createStory(
  'basic',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvList
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);
createStory(
  'infinite_scroll',
  ({
    element,
    stylesheets,
  }: {
    element: Element;
    stylesheets: StyleSheets;
  }) => (
    <HvList
      element={element}
      onUpdate={action('onUpdate')}
      options={Helpers.getOptions()}
      stylesheets={stylesheets}
    />
  ),
);
