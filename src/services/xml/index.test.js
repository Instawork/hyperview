// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Xml from 'hyperview/src/services/xml';

describe('splitAttributeList', () => {
  it('works with empty string', () => {
    expect(Xml.splitAttributeList('')).toEqual([]);
  });

  it('works with only whitespace', () => {
    expect(Xml.splitAttributeList('  \n  \t    \n\n')).toEqual([]);
  });

  it('works with tokens', () => {
    expect(Xml.splitAttributeList('a bc def ghij')).toEqual([
      'a',
      'bc',
      'def',
      'ghij',
    ]);
  });

  it('works with tokens and extra whitespace', () => {
    expect(
      Xml.splitAttributeList('a  \n   bc\t\t\n   def   \t    ghij'),
    ).toEqual(['a', 'bc', 'def', 'ghij']);
  });

  it('works with tokens and leading whitespace', () => {
    expect(
      Xml.splitAttributeList('\n   \n\n\t    a bc def ghij\n\n\t\t    '),
    ).toEqual(['a', 'bc', 'def', 'ghij']);
  });
});
