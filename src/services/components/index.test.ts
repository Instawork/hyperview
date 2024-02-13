import * as Components from 'hyperview/src/services/components';
import type { HvComponentProps } from 'hyperview/src/types';
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
import HvTextField from 'hyperview/src/components/hv-text-field';
import HvView from 'hyperview/src/components/hv-view';
import HvWebView from 'hyperview/src/components/hv-web-view';
import { LOCAL_NAME } from 'hyperview/src/types';
import { PureComponent } from 'react';

const defaultRegistryContent = {
  body: HvView,
  'date-field': HvDateField,
  form: HvView,
  header: HvView,
  image: HvImage,
  item: HvView,
  items: HvView,
  list: HvList,
  option: HvOption,
  'picker-field': HvPickerField,
  'section-list': HvSectionList,
  'section-title': HvView,
  'select-multiple': HvSelectMultiple,
  'select-single': HvSelectSingle,
  spinner: HvSpinner,
  switch: HvSwitch,
  text: HvText,
  'text-area': HvTextField,
  'text-field': HvTextField,
  view: HvView,
  'web-view': HvWebView,
} as const;

const defaultFormRegistryContent = {
  'date-field': HvDateField,
  'picker-field': HvPickerField,
  'select-multiple': HvSelectMultiple,
  'select-single': HvSelectSingle,
  switch: HvSwitch,
  'text-area': HvTextField,
  'text-field': HvTextField,
} as const;

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
        class Foo extends PureComponent<HvComponentProps> {
          static namespaceURI = 'http://foo';

          static localName = LOCAL_NAME.ANIMATED;

          static localNameAliases = [];
        }
        // eslint-disable-next-line react/no-multi-comp
        class Bar extends PureComponent<HvComponentProps> {
          static namespaceURI = 'http://bar';

          static localName = LOCAL_NAME.BEHAVIOR;

          static localNameAliases = [];
        }
        // eslint-disable-next-line react/no-multi-comp
        class Baz extends PureComponent<HvComponentProps> {
          static namespaceURI = 'https://hyperview.org/hyperview';

          static localName = LOCAL_NAME.BODY;

          static localNameAliases = ['baz-1', 'baz-2'];
        }
        expect(Components.getRegistry([Foo, Bar, Baz])).toEqual({
          'http://bar': {
            behavior: Bar,
          },
          'http://foo': {
            animated: Foo,
          },
          'https://hyperview.org/hyperview': {
            ...defaultRegistryContent,
            'baz-1': Baz,
            'baz-2': Baz,
            body: Baz,
          },
        });
      });
    });
  });

  describe('getFormRegistry', () => {
    describe('without arguments', () => {
      it('returns correct registy', () => {
        expect(Components.getFormRegistry()).toEqual({
          'https://hyperview.org/hyperview': defaultFormRegistryContent,
        });
      });
    });
    describe('with arguments', () => {
      it('returns correct registy', () => {
        class Foo extends PureComponent<HvComponentProps> {
          static namespaceURI = 'http://foo';

          static localName = LOCAL_NAME.ANIMATED;

          static localNameAliases = [];

          static getFormInputValues() {
            return [];
          }
        }
        // eslint-disable-next-line react/no-multi-comp
        class Bar extends PureComponent<HvComponentProps> {
          static namespaceURI = 'http://bar';

          static localName = LOCAL_NAME.BEHAVIOR;

          static localNameAliases = [];
        }
        // eslint-disable-next-line react/no-multi-comp
        class Baz extends PureComponent<HvComponentProps> {
          static namespaceURI = 'https://hyperview.org/hyperview';

          static localName = LOCAL_NAME.BODY;

          static localNameAliases = ['baz-1', 'baz-2'];

          static getFormInputValues() {
            return [];
          }
        }
        expect(Components.getFormRegistry([Foo, Bar, Baz])).toEqual({
          'http://foo': {
            animated: Foo,
          },
          'https://hyperview.org/hyperview': {
            ...defaultFormRegistryContent,
            'baz-1': Baz,
            'baz-2': Baz,
            body: Baz,
          },
        });
      });
    });
  });
});
