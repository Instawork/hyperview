// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Components from 'hyperview/src/services/components';
import HvDateField from 'hyperview/src/components/hv-date-field';
import HvImage from 'hyperview/src/components/hv-image';
import HvList from 'hyperview/src/components/hv-list';
import HvOption from 'hyperview/src/components/hv-option';
import HvPickerField from 'hyperview/src/components/hv-picker-field';
import HvSectionList from 'hyperview/src/components/hv-section-list';
import HvSelectMultiple from 'hyperview/src/components/hv-select-multiple';
import HvSelectSingle from 'hyperview/src/components/hv-select-single';
import HvSpinner from 'hyperview/src/components/hv-spinner';
import HvSwitch from 'hyperview/src/components/hv-switch';
import HvText from 'hyperview/src/components/hv-text';
import HvTextArea from 'hyperview/src/components/hv-text-area';
import HvTextField from 'hyperview/src/components/hv-text-field';
import HvView from 'hyperview/src/components/hv-view';
import HvWebView from 'hyperview/src/components/hv-web-view';
import { PureComponent } from 'react';

const defaultRegistryContent = {
  'date-field': HvDateField,
  'picker-field': HvPickerField,
  'section-list': HvSectionList,
  'section-title': HvView,
  'select-multiple': HvSelectMultiple,
  'select-single': HvSelectSingle,
  'text-area': HvTextArea,
  'text-field': HvTextField,
  'web-view': HvWebView,
  body: HvView,
  form: HvView,
  header: HvView,
  image: HvImage,
  item: HvView,
  list: HvList,
  option: HvOption,
  spinner: HvSpinner,
  switch: HvSwitch,
  text: HvText,
  view: HvView,
};

describe('Components', () => {
  describe('getRegistry', () => {
    describe('without arguments', () => {
      it('returns correct registy', () => {
        expect(Components.getRegistry()).toEqual({
          'https://hyperview.org/hyperview': defaultRegistryContent,
        });
      });
    });
    describe('with arguments', () => {
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
          static localNameAliases = [];
        }
        // eslint-disable-next-line react/no-multi-comp
        class Baz extends PureComponent<*> {
          static namespaceURI = 'https://hyperview.org/hyperview';
          static localName = 'baz';
          static localNameAliases = ['baz-1', 'baz-2'];
        }
        expect(Components.getRegistry([Foo, Bar, Baz])).toEqual({
          'http://bar': {
            bar: Bar,
          },
          'http://foo': {
            foo: Foo,
          },
          'https://hyperview.org/hyperview': {
            ...defaultRegistryContent,
            baz: Baz,
            'baz-1': Baz,
            'baz-2': Baz,
          },
        });
      });
    });
  });
});
