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

/**
 * Removes any space that follows a line break
 */
export const ignoreSpacesAfterLineBreak = (input: string): string => input.replace(/\n\s+/g, LINE_BREAK);

/**
 * Replaces any line break by a space
 */
export const convertLineBreaksIntoSpaces = (input: string): string => input.replace(/\n/g, SPACE);

/**
 * Provided a list of strings as input, removes any spaces
 * that immediately follows another space, across consecutive entries in the list
 * i.e.
 * input = [" ", " Hello ", " world ", " ", " "]
 * output = [" ", "Hello ", "world ", "", ""]
 */
export const ignoreSpacesFollowingSpace = (input: string[]): string[] => {
  let lastValueEndedWithSpace = false;
  return input.map((value: string): string => {
    // Replace every consecutive spaces with a single space
    let trimmed = value.replace(/\s+/g, SPACE);

    // If last string ended with a space, remove leading spaces
    if (lastValueEndedWithSpace) {
      trimmed = trimmed.trimStart();
    }

    // Set flag for next iteration, only when the current string is not empty
    if (trimmed.length > 0) {
      lastValueEndedWithSpace = trimmed[trimmed.length - 1] === SPACE;
    }

    return trimmed;
  });
};

/**
 * Provided a list of strings as input, removes any leading and trailing spaces
 * i.e.
 * input = [" ", " Hello ", "world ", " ", " "]
 * output = ["", "Hello ", "world", "", ""]
 */
export const trim = (input: string[]): string[] => {
  // Trim the start of the string
  let trimStartDone = false;
  const startTrimmed: Array<any | string> = [];
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
  const endTrimmed: Array<string> = [];
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
