import type {
  Element,
  Validator,
  Validation,
  ValidatorRegistry,
} from 'hyperview/src/types';
import { NODE_TYPE } from 'hyperview/src/types';

export const V_NS = "https://hyperview.org/hyperview-validation";

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

export const getFirstInvalidMessage = (element: Element): ?string => {
  const x = getValidatorElementsWithInvalidState(element);
  const invalidElement: ?Element = x.find((e) => e.getAttribute("message"));
  return invalidElement ? invalidElement.getAttribute("message") : null;
};
