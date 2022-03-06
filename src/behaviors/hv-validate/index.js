// @flow

import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Dom from 'hyperview/src/services/dom';
import * as Xml from 'hyperview/src/services/xml';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  Document,
  Element,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
  Node,
  Validator,
  Validation,
  ValidatorRegistry,
} from 'hyperview/src/types';
import { NODE_TYPE } from 'hyperview/src/types';
import { later, shallowCloneToRoot } from 'hyperview/src/services';
import { V_NS, dispatchValidation, getValidators } from 'hyperview/src/services/validation';

export default {
  action: 'validate',
  callbackWithOptions: (
    element: Element,
    options: HvBehaviorOptions,
  ) => {
    const { currentElement, onUpdate, getRoot, componentRegistry } = options;

    const root: Document = getRoot();
    const inputId: ?string = element.getAttribute("target");
    const inputElement: Element = inputId ? root.getElementById(inputId) : currentElement;
    const component = componentRegistry[inputElement.namespaceURI] && componentRegistry[inputElement.namespaceURI][inputElement.localName];

    if (component && !Object.prototype.hasOwnProperty.call(component, 'getFormInputValues')) {
      // The target of the behavior is not a form input element, nothing to do.
      return;
    }

    // Get form input values from the element.
    const formComponent: HvFormValue = (component: any);
    const values: Array<string> = formComponent
      .getFormInputValues(inputElement)
      .map(([name: string, value: string]) => value);

    // Find validators for the element
    const validators: Array<[Validator, Element]> = getValidators(inputElement);
    const validationResults: Array<Validation> = validators.reduce((results: Array<Validation>, [v:Validator, e: Element]) => {
      const newResults = values.reduce((results: Array<Validation>, value: string) => {
        const result = v.check(value, e);
        e.setAttributeNS(V_NS, "state", result.valid ? "valid" : "invalid");
        e.setAttributeNS(V_NS, "state-message", result.message);
        return [...results, result];
      }, []);
      return [...results, ...newResults];
    }, []);

    // Find first invalid result.
    const invalid: ?Validation = validationResults.find((v) => !v.valid);
    const message: ?string = invalid ? invalid.message : null;

    //inputElement.setAttributeNS(V_NS, "state", invalid ? "invalid" : "valid");
    onUpdate(null, 'swap', inputElement, { newElement: inputElement.cloneNode(true) });

    const inputElementId = inputElement.getAttribute("id");
    if (inputElementId) {
      const inputValidation: Validation = invalid ? invalid : {valid: true};
      dispatchValidation(inputElementId, inputValidation);
    }
  },
};
