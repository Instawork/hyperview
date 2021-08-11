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

    if(value !== null) {
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

export default {
  action: 'validate',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {

    const inputId: ?string = element.getAttribute("target");
    const inputElement: Element = inputId ? getRoot().getElementById(inputId) : element;

    const value: ?string = inputElement.getAttribute('value');

    // Find validators for the element
    const validators: Array<Validator> = Array.from(targetElement.childNodes)
      .filter((n) => n.nodeType == NODE_TYPE.ELEMENT_NODE)
      .map((e) => {
        const namespace = REGISTRY[e.namespaceURI] || {};
        const validator = namespace[e.localName];
        if (validator) {
          const result = validator.check(value, e);
          console.log(result);
        }
      });
  }
};
