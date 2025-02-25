import HvTextField from 'hyperview/src/components/hv-text-field';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getElements } from 'hyperview/test/helpers';

describe('HvTextField', () => {
  describe('getFormInputValues', () => {
    let elements: Element[];
    beforeEach(() => {
      elements = getElements(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <text-field name="input1" value="hello world" />
                <text-field name="input2" />
                <text-field value="hello world" />
              </body>
            </screen>
          </doc>
        `,
        LOCAL_NAME.TEXT_FIELD,
      );
    });
    it('returns value attr', async () => {
      expect(HvTextField.getFormInputValues(elements[0])).toEqual([
        ['input1', 'hello world'],
      ]);
    });
    it('returns empty string if no value attr', async () => {
      expect(HvTextField.getFormInputValues(elements[1])).toEqual([
        ['input2', ''],
      ]);
    });
    it('returns empty array', async () => {
      expect(HvTextField.getFormInputValues(elements[2])).toEqual([]);
    });
  });
});
