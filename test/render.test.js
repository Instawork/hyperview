// @flow

import initStoryshots, { renderOnly } from '@storybook/addon-storyshots';

initStoryshots({
  test: renderOnly,
});
