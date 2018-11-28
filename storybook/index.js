// @flow

import { configure, getStorybookUI } from '@storybook/react-native';
import { AppRegistry } from 'react-native';
import appKey from './app-key.gen';

configure(() => {
  // Import stories
  // eslint-disable-next-line global-require
  require('./stories.gen');
}, module);

const StorybookUIRoot = getStorybookUI({ port: 7007 });

AppRegistry.registerComponent(appKey, () => StorybookUIRoot);

export default StorybookUIRoot;
