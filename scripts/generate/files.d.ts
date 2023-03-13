/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
declare const fs: any;
declare const mkdirp: any;
declare const path: any;
declare const FILE_ENCODING = "utf8";
/** Read files (in UTF8). Returns null if file is non-existent */
declare const read: (filePath: string) => any;
/**
 * Writes to a file if its contents have changed (in UTF8). Prints to console if file was changed.
 */
declare const writeIfChanged: (filePath: string, contents: string) => void;
