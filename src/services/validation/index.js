import type {
  Element,
  Validator,
  Validation,
  ValidatorRegistry,
} from 'hyperview/src/types';
import { ON_VALIDATE_DISPATCH, NODE_TYPE } from 'hyperview/src/types';
import { HYPERVIEW_VALIDATION } from 'hyperview/src/services/namespaces';

import LengthValidator from 'hyperview/src/validators/length';
import RequiredValidator from 'hyperview/src/validators/required';

import TinyEmitter from 'tiny-emitter';
const tinyEmitter = new TinyEmitter();

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
      return e.getAttributeNS(HYPERVIEW_VALIDATION, "state") === "invalid";
    });
};

export const getValidationState = (element: Element): string => {
  let numValid = 0, numInvalid = 0, numIndeterminate = 0;
  getValidators(element)
    .map(([v: Validator, e: Element]) => {
      const state = e.getAttributeNS(HYPERVIEW_VALIDATION, "state");
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
  const invalidElement: ?Element = x.find((e) => e.getAttributeNS(HYPERVIEW_VALIDATION, "state-message"));
  return invalidElement ? invalidElement.getAttributeNS(HYPERVIEW_VALIDATION, "state-message") : null;
};
