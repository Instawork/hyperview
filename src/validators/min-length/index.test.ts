import MinLength from 'hyperview/src/validators/min-length';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { getElements } from 'hyperview/test/helpers';

function v(xml: string): Element {
  const docXml = `<doc xmlns="https://hyperview.org/hyperview" xmlns:v="https://hyperview.org/hyperview-validation">${xml}</doc>`;
  return getElements(docXml, 'min-length', Namespaces.HYPERVIEW_VALIDATION)[0];
}

describe('MinLength', () => {
  describe('check', () => {
    it('returns valid if value is null', () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check(null, e)).toEqual({ valid: true });
    });
    it('returns invalid if value length is 0', () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check('', e)).toEqual({
        valid: false,
        message: 'This field has bad length',
      });
    });
    it('returns invalid if value length is less than min', () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check('1', e)).toEqual({
        valid: false,
        message: 'This field has bad length',
      });
    });
    it('returns valid if value length is equal to min', () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check('12', e)).toEqual({ valid: true });
    });
    it('returns valid if value length is greater than min', () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check('123', e)).toEqual({
        valid: true,
      });
    });
    it('returns error message if invalid', () => {
      const e = v(
        '<v:min-length min="2" message="Length must be minimum 2" />',
      );
      expect(MinLength.check('1', e)).toEqual({
        message: 'Length must be minimum 2',
        valid: false,
      });
    });
    it('returns invalid if min attribute is non-number', () => {
      const e = v('<v:min-length min="bogus" />');
      expect(MinLength.check('3', e)).toEqual({
        valid: false,
        message: 'This field has bad length',
      });
    });
  });
});
