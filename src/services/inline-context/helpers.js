// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const LINE_BREAK = '\n';
export const EMPTY = '';
export const SPACE = ' ';

export const ignoreSpacesAfterLineBreak = (input: string): string =>
  input.replace(/\n\s+/g, LINE_BREAK);

export const convertLineBreaksIntoSpaces = (input: string): string =>
  input.replace(/\n/g, SPACE);

export const ignoreSpacesFollowingSpace = (input: string[]): string[] => {
  return input.map((value: string, index: number, values: string[]): string => {
    if (index > 0) {
      const previousEntry = values[index - 1];
      const lastChar = previousEntry[previousEntry.length - 1];
      if (lastChar === SPACE || previousEntry === EMPTY) {
        return value.replace(/\s+/g, SPACE).trimStart();
      }
    }
    return value.replace(/\s+/g, SPACE);
  });
};

export const trim = (input: string[]): string[] => {
  // Trim the start of the string
  let trimStartDone = false;
  const startTrimmed = [];
  input.forEach((value: string) => {
    let shouldTrim = false;
    if (startTrimmed.length === 0) {
      shouldTrim = true;
    } else if (!trimStartDone) {
      const previousEntry = startTrimmed[startTrimmed.length - 1];
      if (previousEntry === EMPTY) {
        shouldTrim = true;
      } else {
        trimStartDone = true;
      }
    }
    startTrimmed.push(shouldTrim ? value.trimStart() : value);
  });

  // Trim the end of the string
  let trimEndDone = false;
  const endTrimmed = [];
  startTrimmed.reverse().forEach((value: string) => {
    let shouldTrim = false;
    if (endTrimmed.length === 0) {
      shouldTrim = true;
    } else if (!trimEndDone) {
      const previousEntry = endTrimmed[endTrimmed.length - 1];
      if (previousEntry === EMPTY) {
        shouldTrim = true;
      } else {
        trimEndDone = true;
      }
    }
    endTrimmed.push(shouldTrim ? value.trimEnd() : value);
  });

  return endTrimmed.reverse();
};
