import * as Services from 'hyperview/src/services';
import type { HvComponent } from 'hyperview/src/types';
import HvDateField from 'hyperview/src/elements/hv-date-field';
import type { HvFormValues } from './types';
import HvImage from 'hyperview/src/elements/hv-image';
import HvList from 'hyperview/src/elements/hv-list';
import HvOption from 'hyperview/src/elements/hv-option';
import HvPickerField from 'hyperview/src/elements/hv-picker-field';
import HvSectionList from 'hyperview/src/elements/hv-section-list';
import HvSelectMultiple from 'hyperview/src/elements/hv-select-multiple';
import HvSelectSingle from 'hyperview/src/elements/hv-select-single';
import HvSpinner from 'hyperview/src/elements/hv-spinner';
import HvSwitch from 'hyperview/src/elements/hv-switch';
import HvText from 'hyperview/src/elements/hv-text';
import HvTextField from 'hyperview/src/elements/hv-text-field';
import HvView from 'hyperview/src/elements/hv-view';
import HvWebView from 'hyperview/src/elements/hv-web-view';

const HYPERVIEW_COMPONENTS = [
  HvDateField,
  HvList,
  HvOption,
  HvPickerField,
  HvSectionList,
  HvSelectMultiple,
  HvSelectSingle,
  HvSpinner,
  HvSwitch,
  HvText,
  HvTextField,
  HvImage,
  HvView,
  HvWebView,
];

export class Registry {
  components: HvComponent[];

  constructor(components: HvComponent[] | null | undefined = null) {
    this.components = [...HYPERVIEW_COMPONENTS, ...(components || [])];
  }

  getComponent(
    namespaceURI: string,
    localName: string,
  ): HvComponent | undefined {
    return this.components.find(
      component =>
        component.namespaceURI === namespaceURI &&
        (component.localName === localName ||
          (component.localNameAliases || []).includes(localName)),
    );
  }

  hasComponent(namespaceURI: string, localName: string): boolean {
    return this.getComponent(namespaceURI, localName) !== undefined;
  }

  /**
   * Creates a FormData object for the given element. Finds the closest form element ancestor
   * and adds data for all inputs contained in the form. Returns null if the element has no
   * form ancestor, or if there is no form data to send.
   * If the given element is a form element, its form data will be returned.
   */
  getFormData(element: Element): FormData | null {
    const formElement: Element | null | undefined =
      element.tagName === 'form'
        ? element
        : Services.getAncestorByTagName(element, 'form');
    if (!formElement) {
      return null;
    }

    const formData: FormData = new FormData();
    let formHasData = false;

    this.components
      .filter(c =>
        Object.prototype.hasOwnProperty.call(c, 'getFormInputValues'),
      )
      .forEach((c: HvComponent) => {
        const ns = c.namespaceURI;
        const localNames = [c.localName, ...(c.localNameAliases || [])];
        localNames.forEach(tag => {
          const inputElements = formElement.getElementsByTagNameNS(ns, tag);
          for (let i = 0; i < inputElements.length; i += 1) {
            const inputElement = inputElements.item(i);
            if (inputElement) {
              const formComponent = c as HvComponent & HvFormValues;
              formComponent
                .getFormInputValues(inputElement)
                // eslint-disable-next-line no-loop-func
                .forEach(([name, value]: [string, string]) => {
                  formData.append(name, value);
                  formHasData = true;
                });
            }
          }
        });
      });

    // Ensure that we only return form data with content in it. Otherwise, it will crash on Android
    return formHasData ? formData : null;
  }
}
