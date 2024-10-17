import MinLength from 'hyperview/src/validators/min-length';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { getElements } from 'hyperview/test/helpers';

function v(xml: string): Element {
  const docXml = `<doc xmlns="https://hyperview.org/hyperview" xmlns:v="https://hyperview.org/hyperview-validation">${xml}</doc>`;
  return getElements(docXml, 'min-length', Namespaces.HYPERVIEW_VALIDATION)[0];
}

describe('MinLength', () => {
  describe('check', () => {
    let elements: Element[];
    beforeEach(() => {
      elements = getElements(
        `
          <doc
            xmlns="https://hyperview.org/hyperview"
            xmlns:v="https://hyperview.org/hyperview-validation"
          >
            <text-field>
              <v:min-length min="2" />
              <v:min-length min="2" message="Length must be minimum 2" />
            </text-field>
          </doc>
        `,
        'min-length',
        Namespaces.HYPERVIEW_VALIDATION,
      );
    });
    it('returns valid if value is null', async () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check(null, e)).toEqual({ valid: true });
    });
    it('returns invalid if value length is 0', async () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check('', e)).toEqual({
        valid: false,
        message: 'This field has bad length',
      });
    });
    it('returns invalid if value length is less than min', async () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check('1', e)).toEqual({
        valid: false,
        message: 'This field has bad length',
      });
    });
    it('returns valid if value length is equal to min', async () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check('12', e)).toEqual({ valid: true });
    });
    it('returns valid if value length is greater than min', async () => {
      const e = v('<v:min-length min="2" />');
      expect(MinLength.check('123', e)).toEqual({
        valid: true,
      });
    });
    it('returns error message if invalid', async () => {
      const e = v(
        '<v:min-length min="2" message="Length must be minimum 2" />',
      );
      expect(MinLength.check('1', e)).toEqual({
        message: 'Length must be minimum 2',
        valid: false,
      });
    });
  });
});
