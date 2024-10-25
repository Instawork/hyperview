import MaxLength from 'hyperview/src/validators/max-length';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { getElements } from 'hyperview/test/helpers';

function v(xml: string): Element {
  const docXml = `<doc xmlns="https://hyperview.org/hyperview" xmlns:v="https://hyperview.org/hyperview-validation">${xml}</doc>`;
  return getElements(docXml, 'max-length', Namespaces.HYPERVIEW_VALIDATION)[0];
}

describe('MaxLength', () => {
  describe('check', () => {
    it('returns valid if value is null', () => {
      const e = v('<v:max-length max="2" />');
      expect(MaxLength.check(null, e)).toEqual({ valid: true });
    });
    it('returns valid if value length is 0', () => {
      const e = v('<v:max-length max="2" />');
      expect(MaxLength.check('', e)).toEqual({ valid: true });
    });
    it('returns valid if value length is less than max', () => {
      const e = v('<v:max-length max="2" />');
      expect(MaxLength.check('1', e)).toEqual({ valid: true });
    });
    it('returns valid if value length is equal to max', () => {
      const e = v('<v:max-length max="2" />');
      expect(MaxLength.check('12', e)).toEqual({ valid: true });
    });
    it('returns invalid if value length is greater than max', () => {
      const e = v('<v:max-length max="2" />');
      expect(MaxLength.check('123', e)).toEqual({
        message: 'This field has bad length',
        valid: false,
      });
    });
    it('returns error message if invalid', () => {
      const e = v(
        '<v:max-length max="2" message="Length must be no more than 2" />',
      );
      expect(MaxLength.check('1234', e)).toEqual({
        message: 'Length must be no more than 2',
        valid: false,
      });
    });
    it('returns invalid if max attribute is non-number', () => {
      const e = v('<v:max-length max="bogus" />');
      expect(MaxLength.check('3', e)).toEqual({
        message: 'This field has bad length',
        valid: false,
      });
    });
  });
});
