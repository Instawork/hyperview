// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Files from './files';
import glob from 'glob';
import path from 'path';

const targetFilePath = path.join(__dirname, '../../storybook/stories.gen.js');
const projectPath = path.join(__dirname, '../..');

const stories = glob
  .sync(path.join(__dirname, '../../src/**/stories/index.js'))
  .map(storyPath => `import '../${path.relative(projectPath, storyPath).replace(/\\/g, '/')}';`)
  .sort();

const lines = [
  '// DO NOT EDIT: Auto-generate this file by running `yarn generate`',
  ...stories,
  '',
].join('\n');

if (Files.writeIfChanged(targetFilePath, lines)) {
  console.log(`Updated ${targetFilePath}`);
}
