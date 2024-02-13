import HvSelectMultiple from 'hyperview/src/components/hv-select-multiple';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getElements } from 'hyperview/test/helpers';

describe('HvSelectMultiple', () => {
  describe('getFormInputValues', () => {
    let elements: Element[];
    beforeEach(() => {
      elements = getElements(
        `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <body>
                <select-multiple name="input1">
                  <option value="1" />
                  <option value="2" selected="false" />
                  <option value="3" selected="true" />
                </select-multiple>
                <select-multiple name="input2">
                  <option value="1" />
                  <option value="2" />
                  <option value="3" />
                </select-multiple>
                <select-multiple name="input3">
                  <option value="1" />
                  <option selected="true" />
                  <option value="3" selected="true" />
                </select-multiple>
                <select-multiple name="input4">
                  <option value="1" />
                  <option value="2" selected="true" />
                  <option value="3" selected="true" />
                </select-multiple>
                <select-multiple>
                  <option value="1" />
                  <option value="2" selected="true" />
                  <option value="3" selected="true" />
                </select-multiple>
              </body>
            </screen>
          </doc>
        `,
        LOCAL_NAME.SELECT_MULTIPLE,
      );
    });
    it('returns selected option value attr', async () => {
      expect(HvSelectMultiple.getFormInputValues(elements[0])).toEqual([
        ['input1', '3'],
      ]);
    });
    it('returns empty array if no selected option', async () => {
      expect(HvSelectMultiple.getFormInputValues(elements[1])).toEqual([]);
    });
    it('returns empty string if selection option has no value attr', async () => {
      expect(HvSelectMultiple.getFormInputValues(elements[2])).toEqual([
        ['input3', ''],
        ['input3', '3'],
      ]);
    });
    it('returns all options with selected attr', async () => {
      expect(HvSelectMultiple.getFormInputValues(elements[3])).toEqual([
        ['input4', '2'],
        ['input4', '3'],
      ]);
    });
    it('returns empty array if no name attr', async () => {
      expect(HvSelectMultiple.getFormInputValues(elements[4])).toEqual([]);
    });
  });
});
