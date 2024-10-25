import MinValue from 'hyperview/src/validators/min-value';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { getElements } from 'hyperview/test/helpers';

function v(xml: string): Element {
  const docXml = `<doc xmlns="https://hyperview.org/hyperview" xmlns:v="https://hyperview.org/hyperview-validation">${xml}</doc>`;
  return getElements(docXml, 'min-value', Namespaces.HYPERVIEW_VALIDATION)[0];
}

describe('MinValue', () => {
  describe('check', () => {
    it('returns valid if value is null', () => {
      const e = v('<v:min-value min="2" />');
      expect(MinValue.check(null, e)).toEqual({ valid: true });
    });
    it('returns valid if value is undefined', () => {
      const e = v('<v:min-value min="2" />');
      expect(MinValue.check(undefined, e)).toEqual({ valid: true });
    });
    it('returns valid if value is empty string', () => {
      const e = v('<v:min-value min="2" />');
      expect(MinValue.check('', e)).toEqual({ valid: true });
    });
    it('returns invalid if value is non-number', () => {
      const e = v('<v:min-value min="2" />');
      expect(MinValue.check('bogus', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
    it('returns invalid if min attribute is non-number', () => {
      const e = v('<v:min-value min="bogus" />');
      expect(MinValue.check('3', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });

    it('returns error message if invalid', () => {
      const e = v('<v:min-value min="2" message="Value must be minimum 2" />');
      expect(MinValue.check('1', e)).toEqual({
        message: 'Value must be minimum 2',
        valid: false,
      });
    });

    it('returns invalid if value is 0', () => {
      const e = v('<v:min-value min="2" />');
      expect(MinValue.check('0', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
    it('returns invalid if value is less than min', () => {
      const e = v('<v:min-value min="2" />');
      expect(MinValue.check('1', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
    it('returns valid if value is equal to min', () => {
      const e = v('<v:min-value min="2" />');
      expect(MinValue.check('2', e)).toEqual({ valid: true });
    });
    it('returns valid if float value is greater than min', () => {
      const e = v('<v:min-value min="2" />');
      expect(MinValue.check('2.1', e)).toEqual({ valid: true });
    });

    it('returns valid if float value is greater than float min', () => {
      const e = v('<v:min-value min="2.5" />');
      expect(MinValue.check('2.51', e)).toEqual({ valid: true });
    });
    it('returns valid if float value is equal to float min', () => {
      const e = v('<v:min-value min="2.5" />');
      expect(MinValue.check('2.5', e)).toEqual({ valid: true });
    });
    it('returns invalid if float value is less than float min', () => {
      const e = v('<v:min-value min="2.5" />');
      expect(MinValue.check('2.499', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });

    it('returns valid if value is greater than negative min', () => {
      const e = v('<v:min-value min="-2" />');
      expect(MinValue.check('-1.99', e)).toEqual({ valid: true });
    });
    it('returns valid if float value is equal to negaitve min', () => {
      const e = v('<v:min-value min="-2" />');
      expect(MinValue.check('-2', e)).toEqual({ valid: true });
    });
    it('returns invalid if float value is less than negaitve min', () => {
      const e = v('<v:min-value min="-2" />');
      expect(MinValue.check('-2.1', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });

    it('returns valid if value is greater than negative float min', () => {
      const e = v('<v:min-value min="-2.5" />');
      expect(MinValue.check('-2.49', e)).toEqual({ valid: true });
    });
    it('returns valid if float value is equal to negative float min', () => {
      const e = v('<v:min-value min="-2.5" />');
      expect(MinValue.check('-2.5', e)).toEqual({ valid: true });
    });
    it('returns invalid if float value is less than negative float min', () => {
      const e = v('<v:min-value min="-2.5" />');
      expect(MinValue.check('-2.51', e)).toEqual({
        valid: false,
        message: 'This field has bad value',
      });
    });
  });
});
