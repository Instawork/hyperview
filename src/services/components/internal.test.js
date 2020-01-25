// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as ComponentsInternal from './internal';
import { PureComponent } from 'react';

describe('ComponentsInternal', () => {
  describe('registerComponent', () => {
    it('returns correct registy', () => {
      class Foo extends PureComponent<*> {
        static namespaceURI = 'http://foo';
        static localName = 'foo';
        static localNameAliases = [];
      }
      // eslint-disable-next-line react/no-multi-comp
      class Bar extends PureComponent<*> {
        static namespaceURI = 'http://bar';
        static localName = 'bar';
        static localNameAliases = ['bar-1', 'bar-2'];
      }
      expect(ComponentsInternal.registerComponent(Foo)).toEqual({
        foo: Foo,
      });

      expect(ComponentsInternal.registerComponent(Bar)).toEqual({
        bar: Bar,
        'bar-1': Bar,
        'bar-2': Bar,
      });
    });
  });
});
