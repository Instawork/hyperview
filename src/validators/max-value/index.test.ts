import MaxValue from 'hyperview/src/validators/max-value';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { getElements } from 'hyperview/test/helpers';

function v(xml: string): Element {
  const docXml = `<doc xmlns="https://hyperview.org/hyperview" xmlns:v="https://hyperview.org/hyperview-validation">${xml}</doc>`;
  return getElements(docXml, 'max-value', Namespaces.HYPERVIEW_VALIDATION)[0];
}

describe('MaxValue', () => {
  describe('check', () => {
    it('returns valid if value is null', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check(null, e)).toEqual({ valid: true });
    });
    it('returns valid if value is undefined', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check(undefined, e)).toEqual({ valid: true });
    });
    it('returns valid if value is empty string', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check('', e)).toEqual({ valid: true });
    });
    it('returns invalid if value is non-number', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check('bogus', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
    it('returns invalid if max attribute is non-number', () => {
      const e = v('<v:max-value max="bogus" />');
      expect(MaxValue.check('1', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });

    it('returns error message if invalid', () => {
      const e = v('<v:max-value max="2" message="Value must be max 2" />');
      expect(MaxValue.check('3', e)).toEqual({
        message: 'Value must be max 2',
        valid: false,
      });
    });

    it('returns valid if value is 0', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check('0', e)).toEqual({ valid: true });
    });
    it('returns valid if value is less than max', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check('1', e)).toEqual({ valid: true });
    });
    it('returns valid if value is equal to max', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check('2', e)).toEqual({ valid: true });
    });
    it('returns valid if float value is less than max', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check('1.9', e)).toEqual({ valid: true });
    });
    it('returns invalid if value is greater than max', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check('4', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
    it('returns invalid if float value is greater than max', () => {
      const e = v('<v:max-value max="2" />');
      expect(MaxValue.check('4.5', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });

    it('returns invalid if float value is greater than float max', () => {
      const e = v('<v:max-value max="2.5" />');
      expect(MaxValue.check('2.51', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
    it('returns valid if float value is equal to float max', () => {
      const e = v('<v:max-value max="2.5" />');
      expect(MaxValue.check('2.5', e)).toEqual({ valid: true });
    });
    it('returns valid if float value is less than float max', () => {
      const e = v('<v:max-value max="2.5" />');
      expect(MaxValue.check('2.499', e)).toEqual({ valid: true });
    });

    it('returns invalid if value is greater than negative max', () => {
      const e = v('<v:max-value max="-2" />');
      expect(MaxValue.check('-1.99', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
    it('returns valid if float value is equal to negative max', () => {
      const e = v('<v:max-value max="-2" />');
      expect(MaxValue.check('-2', e)).toEqual({ valid: true });
    });
    it('returns valid if float value is less than negative max', () => {
      const e = v('<v:max-value max="-2" />');
      expect(MaxValue.check('-2.1', e)).toEqual({ valid: true });
    });

    it('returns invalid if value is greater than negative float max', () => {
      const e = v('<v:max-value max="-2.5" />');
      expect(MaxValue.check('-2.49', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
    it('returns valid if float value is equal to negative float max', () => {
      const e = v('<v:max-value max="-2.5" />');
      expect(MaxValue.check('-2.5', e)).toEqual({ valid: true });
    });
    it('returns valid if float value is less than negative float max', () => {
      const e = v('<v:max-value max="-2.5" />');
      expect(MaxValue.check('-2.51', e)).toEqual({ valid: true });
    });
  });
});
