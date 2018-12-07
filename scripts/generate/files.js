/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const FILE_ENCODING = 'utf8';

/** Read files (in UTF8). Returns null if file is non-existent */
const read = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, FILE_ENCODING);
};

/**
 * Writes to a file if its contents have changed (in UTF8). Prints to console if file was changed.
*/
const writeIfChanged = (filePath: string, contents: string) => {
  if (fs.existsSync(filePath) && read(filePath) === contents) {
    return;
  }

  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, contents, { encoding: FILE_ENCODING });
  console.log(`Updated ${filePath}`);
};

module.exports = { read, writeIfChanged };
