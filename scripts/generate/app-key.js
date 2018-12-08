// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Files from './files';
import path from 'path';

const targetFilePath = path.join(__dirname, '../../storybook/app-key.gen.js');

if (!process.argv[2]) {
  console.log(`
    Usage: yarn generate <application_key>
    
    <application_key>: string passed as a first argument to the method 'AppRegistry.registerComponent' in your root react-native component.
    
  `);
  process.exit();
}

const lines = [
  '// DO NOT EDIT: Auto-generate this file by running `yarn generate`',
  `export default '${process.argv[2]}';`,
  '',
].join('\n');

if (Files.writeIfChanged(targetFilePath, lines)) {
  console.log(`Updated ${targetFilePath}`);
}
