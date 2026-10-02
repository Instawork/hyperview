import fs from 'fs';

const FILE_ENCODING = 'utf8';

/** Read files (in UTF8). Returns null if file is non-existent */
export const read = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, FILE_ENCODING);
};
