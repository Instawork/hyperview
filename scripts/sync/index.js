// @flow

const childProcess = require('child_process');
const chokidar = require('chokidar');
const pathModule = require('path');

const PROJECT_DIR = pathModule.join(__dirname, '../..');
const SRC_DIR = pathModule.join(PROJECT_DIR, 'src');
const DEST_PROJECT_REL_PATH = process.argv[2] || './demo';
const HYPERVIEW_DIR = pathModule.join(
  PROJECT_DIR,
  DEST_PROJECT_REL_PATH,
  '/node_modules/hyperview',
);

const updatePackageJson = () => {
  console.log('Updating package.json…');
  const cmd = `sed -i.bak 's/lib\\/index.js/src\\/index.js/g' ${HYPERVIEW_DIR}/package.json`;
  childProcess.execSync(cmd);
};

const syncFiles = (event, path = SRC_DIR) => {
  console.log(`Syncing ${path} with ${HYPERVIEW_DIR}…`);
  const cmd = `rsync -v -r --delete ${path} ${HYPERVIEW_DIR}`;
  childProcess.execSync(cmd);
};

updatePackageJson();
chokidar.watch(SRC_DIR).on('all', syncFiles);
