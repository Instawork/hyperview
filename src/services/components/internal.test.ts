/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as ComponentsInternal from './internal';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { PureComponent } from 'react';

describe('ComponentsInternal', () => {
  describe('registerComponent', () => {
    it('returns correct registy', () => {
      class Foo extends PureComponent<HvComponentProps> {
        static namespaceURI = 'http://foo';

        static localName = LOCAL_NAME.ANIMATED;

        static localNameAliases = [];
      }
      // eslint-disable-next-line react/no-multi-comp
      class Bar extends PureComponent<HvComponentProps> {
        static namespaceURI = 'http://bar';

        static localName = LOCAL_NAME.BEHAVIOR;

        static localNameAliases = ['bar-1', 'bar-2'];
      }
      expect(ComponentsInternal.registerComponent(Foo)).toEqual({
        animated: Foo,
      });

      expect(ComponentsInternal.registerComponent(Bar)).toEqual({
        'bar-1': Bar,
        'bar-2': Bar,
        behavior: Bar,
      });
    });
  });
});
