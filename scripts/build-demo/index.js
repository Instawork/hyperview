// @flow

const childProcess = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '../..');
const SRC_DIR = path.join(PROJECT_DIR, 'src');
const HYPERVIEW_DIR = path.join(PROJECT_DIR, 'demo/node_modules/hyperview');

const updatePackageJson = () => {
  console.log('Updating package.json...');
  const cmd = `sed -i.bak 's/lib\\/index.js/src\\/index.js/g' ${HYPERVIEW_DIR}/package.json`;
  childProcess.execSync(cmd);
  console.log('Done!');
};

const syncFiles = () => {
  console.log('Syncing files...');
  const cmd = `rsync -v -r --delete ${SRC_DIR} ${HYPERVIEW_DIR}`;
  childProcess.execSync(cmd);
  console.log('Done!');
};

updatePackageJson();
syncFiles();
chokidar.watch(SRC_DIR).on('all', syncFiles);
