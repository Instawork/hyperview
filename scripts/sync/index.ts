import childProcess from 'child_process';
import chokidar from 'chokidar';
import path from 'path';

const PROJECT_DIR = path.join(__dirname, '../..');
const SRC_DIRNAME = process.argv[3] || 'src';
const SRC_DIR = path.join(PROJECT_DIR, SRC_DIRNAME);
const DEST_PROJECT_REL_PATH = process.argv[2] || './demo';
const HYPERVIEW_DIR = path.join(
  PROJECT_DIR,
  DEST_PROJECT_REL_PATH,
  '/node_modules/hyperview',
);
const HYPERVIEW_SRC_DIR = path.join(HYPERVIEW_DIR, SRC_DIRNAME);

const updatePackageJson = () => {
  console.log('Updating package.json…');
  const cmd = `sed -i.bak 's/lib\\/index.js/${SRC_DIRNAME}\\/index.ts/g' ${HYPERVIEW_DIR}/package.json`;
  childProcess.execSync(cmd);
};

const syncFiles = (event: unknown, originPath: string) => {
  const relativeOriginPath = originPath.replace(SRC_DIR, '');
  const destinationPath = path.dirname(
    path.join(HYPERVIEW_SRC_DIR, relativeOriginPath),
  );
  console.log(`Syncing ${originPath} with ${destinationPath}/…`);
  const cmd = `rsync -v -r --delete ${originPath} ${destinationPath}/`;
  childProcess.execSync(cmd);
};

updatePackageJson();
chokidar.watch(SRC_DIR).on('all', syncFiles);
