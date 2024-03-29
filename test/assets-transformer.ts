// This file is a workaround mentioned here:
// https://github.com/facebook/jest/issues/2663#issuecomment-317109798

import path from 'path';

module.exports = {
  process(src: string, filename: string) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
