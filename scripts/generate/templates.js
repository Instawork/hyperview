// @flow

import * as Files from './files';
import glob from 'glob';
import packageJson from '../../package.json';
import path from 'path';

const rootDir = path.join(__dirname, '../..');
const targetFilePath = path.join(rootDir, 'storybook/templates.gen.js');
const projectName = packageJson.name;

const templates = glob
  .sync(path.join(rootDir, 'src/**/stories/*.xml'))
  .map((templateAbsolutePath) => {
    const templatePath = templateAbsolutePath.replace(rootDir, projectName);
    return `  '${templatePath}':\n  \`${Files.read(templateAbsolutePath) || ''}\`,`;
  })
  .sort();

const lines = [
  '// DO NOT EDIT: Auto-generate this file by running `yarn generate`',
  'export default {',
  ...templates,
  '};',
  '',
].join('\n');

if (Files.writeIfChanged(targetFilePath, lines)) {
  console.log(`Updated ${targetFilePath}`);
}
