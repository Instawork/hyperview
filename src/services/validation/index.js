import type {
  Element,
  Validator,
  Validation,
  ValidatorRegistry,
} from 'hyperview/src/types';
import { ON_VALIDATE_DISPATCH, NODE_TYPE } from 'hyperview/src/types';

import TinyEmitter from 'tiny-emitter';
const tinyEmitter = new TinyEmitter();

export const V_NS = "https://hyperview.org/hyperview-validation";

export const dispatchValidation = (targetId: string, validation: Validation) => {
  if (__DEV__) {
    console.log(`[dispatch-validation] [${targetId}: ${validation.valid}] emmitted.`);
  }
  tinyEmitter.emit(ON_VALIDATE_DISPATCH, targetId, validation);
};

export const subscribe = (callback: (targetId: string, validation: Validation) => void) =>
  tinyEmitter.on(ON_VALIDATE_DISPATCH, callback);

export const unsubscribe = (callback: (targetId: string, validation: Validation) => void) =>
  tinyEmitter.off(ON_VALIDATE_DISPATCH, callback);

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

export const REGISTRY: ValidatorRegistry = {};

VALIDATORS.forEach((v) => {
  const namespaceDict = REGISTRY[v.namespace] || {};
  namespaceDict[v.name] = v;
  REGISTRY[v.namespace] = namespaceDict;
});


export const getValidators = (element: Element): Array<[Validator, Element]> => {
  return Array.from(element.childNodes)
    .filter((n) => n.nodeType == NODE_TYPE.ELEMENT_NODE)
    .map((e) => {
      const namespace = REGISTRY[e.namespaceURI] || {};
      const validator = namespace[e.localName];
      if (validator) {
        return [validator, e];
      }
      return null;
    })
    .filter((v) => !!v);
};

export const getValidatorElementsWithInvalidState = (element: Element): Array<Element> => {
  return getValidators(element)
    .map(([v: Validator, e: Element]) => e)
    .filter((e: Element) => {
      return e.getAttributeNS(V_NS, "state") === "invalid";
    });
};


export const getValidationState = (element: Element): string => {
  let numValid = 0, numInvalid = 0, numIndeterminate = 0;
  getValidators(element)
    .map(([v: Validator, e: Element]) => {
      const state = e.getAttributeNS(V_NS, "state");
      if (state == "valid") {
        numValid++;
      } else if (state == "invalid") {
        numInvalid++;
      } else {
        numIndeterminate++;
      }
    });

  return numInvalid > 0 ? "invalid" : numIndeterminate > 0 ? "indeterminate" : "valid";
};


export const getFirstInvalidMessage = (element: Element): ?string => {
  const x = getValidatorElementsWithInvalidState(element);
  const invalidElement: ?Element = x.find((e) => e.getAttributeNS(V_NS, "state-message"));
  return invalidElement ? invalidElement.getAttributeNS(V_NS, "state-message") : null;
};
