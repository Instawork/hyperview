// @flow

import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Xml from 'hyperview/src/services/xml';
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

const V_NS = "https://hyperview.org/hyperview-validation";

const RequiredValidator: Validator = {
  namespace: V_NS,
  name: "required",
  check: (value: ?string, element: Element): Validation => {
    if (!!value) {
      return {
        valid: true,
      };
    }
    return {
      valid: false,
      message: element.getAttribute('message') || 'This field is required',
    };
  },
};


const LengthValidator: Validator = {
  namespace: V_NS,
  name: "length",
  check: (value: ?string, element: Element): Validation => {

    const minLength = parseInt(element.getAttribute('min-length'), 10);
    const maxLength = parseInt(element.getAttribute('max-length'), 10);

    if (value !== null) {
      if (value.length < minLength || value.length > maxLength) {
        return {
          valid: false,
          message: element.getAttribute('message') || 'This field has bad length',
        }
      }
    }

    return { valid: true };
  },
};

const VALIDATORS = [
  RequiredValidator,
  LengthValidator,
];

const REGISTRY: ValidatorRegistry = {};

VALIDATORS.forEach((v) => {
  const namespaceDict = REGISTRY[v.namespace] || {};
  namespaceDict[v.name] = v;
  REGISTRY[v.namespace] = namespaceDict;
});

const getValidators = (element: Element): Array<Validator> => {
  return Array.from(element.childNodes)
    .filter((n) => n.nodeType == NODE_TYPE.ELEMENT_NODE)
    .map((e) => {
      const namespace = REGISTRY[e.namespaceURI] || {};
      const validator = namespace[e.localName];
      if (validator) {
        return validator;
      }
      return null;
    })
    .filter((v) => !!v);
};

export default {
  action: 'validate',
  callbackWithOptions: (
    element: Element,
    options: HVBehaviorOptions,
  ) => {
    const { getRoot, componentRegistry } = options;

    const inputId: ?string = element.getAttribute("target");
    const inputElement: Element = inputId ? getRoot().getElementById(inputId) : element;
    const component = componentRegistry[inputElement.namespaceURI] && componentRegistry[inputElement.namespaceURI][inputElement.localName];

    if (component && Object.prototype.hasOwnProperty.call(component, 'getFormInputValues')) {
      // The target of the behavior is not a form input element, nothing to do.
      return;
    }

    // Get form input values from the element.
    const formComponent: HvFormValue = (component: any);
    const values: Array<string> = formComponent
      .getFormInputValues(inputElement)
      .map(([name: string, value: string]) => value);

    // Find validators for the element
    const validators: Array<Validator> = getValidators(inputElement);
  }
};
