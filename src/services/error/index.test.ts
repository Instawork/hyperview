/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HvBaseError } from './';

describe('HvBaseError', () => {
  describe('When instanciated directly', () => {
    it('Throws an error', () => {
      expect(() => new HvBaseError('custom message')).toThrow(
        'Do not instanciate `HvBaseError` directly',
      );
    });
  });
  describe('When extended', () => {
    class HvCustomError extends HvBaseError {
      name = 'HvCustomError';
    }
    it('Does not throws', () => {
      expect(() => {
        return new HvCustomError('custom message');
      }).not.toThrow();
    });
    it('Return correct fingerprint', () => {
      const error = new HvCustomError('custom message');
      expect(error.getFingerprint()).toEqual([
        'HvCustomError',
        'custom message',
      ]);
    });
    describe('setExtraContext', () => {
      it('Handles strings', () => {
        const error = new HvCustomError('custom message');
        error.setExtraContext('foo', 'bar');
        expect(error.extraContext).toEqual({ foo: 'bar' });
      });
      it('Handles named functions', () => {
        const error = new HvCustomError('custom message');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const Foo = () => {};
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function Bar() {}
        error.setExtraContext('foo', Foo);
        error.setExtraContext('bar', Bar);
        expect(error.extraContext).toEqual({ bar: 'Bar', foo: 'Foo' });
      });
      it('Handles anonymous functions', () => {
        const error = new HvCustomError('custom message');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        error.setExtraContext('foo', () => {});
        expect(error.extraContext).toEqual({ foo: 'anonymous function' });
      });
      it('Handles booleans', () => {
        const error = new HvCustomError('custom message');
        error.setExtraContext('foo', true);
        error.setExtraContext('bar', false);
        expect(error.extraContext).toEqual({ bar: 'false', foo: 'true' });
      });
      it('Handles undefined and null', () => {
        const error = new HvCustomError('custom message');
        error.setExtraContext('foo', undefined);
        error.setExtraContext('bar', null);
        expect(error.extraContext).toEqual({ bar: 'null', foo: 'undefined' });
      });
      it('Handles NaN', () => {
        const error = new HvCustomError('custom message');
        error.setExtraContext('foo', NaN);
        expect(error.extraContext).toEqual({ foo: 'NaN' });
      });
      it('Handles objects', () => {
        const error = new HvCustomError('custom message');
        error.setExtraContext('foo', { foo: { bar: 'baz' } });
        expect(error.extraContext).toEqual({ foo: '{"foo":{"bar":"baz"}}' });
      });
    });
  });
});
