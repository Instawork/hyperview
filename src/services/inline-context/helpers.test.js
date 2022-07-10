// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  convertLineBreaksIntoSpaces,
  ignoreSpacesAfterLineBreak,
  ignoreSpacesFollowingSpace,
  trim,
} from './helpers';

describe('ignoreSpacesAfterLineBreak', () => {
  test('1', () => {
    expect(ignoreSpacesAfterLineBreak('\n ')).toEqual('\n');
  });
  test('2', () => {
    expect(ignoreSpacesAfterLineBreak('\n   ')).toEqual('\n');
  });
  test('3', () => {
    expect(ignoreSpacesAfterLineBreak(' \n   ')).toEqual(' \n');
  });
  test('4', () => {
    expect(ignoreSpacesAfterLineBreak('  \n   ')).toEqual('  \n');
  });
});

describe('convertLineBreaksIntoSpaces', () => {
  test('1', () => {
    expect(convertLineBreaksIntoSpaces('\n')).toEqual(' ');
  });
  test('2', () => {
    expect(convertLineBreaksIntoSpaces('  \n\n  ')).toEqual('      ');
  });
  test('3', () => {
    expect(convertLineBreaksIntoSpaces(' \n \n ')).toEqual('     ');
  });
});

describe('ignoreSpacesFollowingSpace', () => {
  test('1', () => {
    expect(ignoreSpacesFollowingSpace([' ', ' ', ' '])).toEqual([' ', '', '']);
  });
  test('2', () => {
    expect(ignoreSpacesFollowingSpace([' ', ' foo ', ' '])).toEqual([
      ' ',
      'foo ',
      '',
    ]);
  });
  test('3', () => {
    expect(
      ignoreSpacesFollowingSpace([' ', '  foo  ', ' bar   baz  ', ' ']),
    ).toEqual([' ', 'foo ', 'bar baz ', '']);
  });
  test('4', () => {
    expect(
      ignoreSpacesFollowingSpace([
        ' ',
        '',
        ' ',
        '',
        '  foo  ',
        '',
        ' ',
        '',
        '  bar   baz  ',
        ' ',
        '',
        ' ',
      ]),
    ).toEqual([' ', '', '', '', 'foo ', '', '', '', 'bar baz ', '', '', '']);
  });
});

describe('trim', () => {
  test('1', () => {
    expect(trim([' ', 'foo', ' '])).toEqual(['', 'foo', '']);
  });
  test('2', () => {
    expect(trim([' ', '  foo  ', ' '])).toEqual(['', 'foo', '']);
  });
  test('3', () => {
    expect(trim([' ', '', '  foo  ', '', ' '])).toEqual([
      '',
      '',
      'foo',
      '',
      '',
    ]);
  });
  test('4', () => {
    expect(trim(['', 'foo', ''])).toEqual(['', 'foo', '']);
  });
});
