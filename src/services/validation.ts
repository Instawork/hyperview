import * as DomService from 'hyperview/src/services/dom';
import * as Xml from 'hyperview/src/services/xml';
import type {
  Document,
  Element,
  Validation,
  Validator,
  ValidatorRegistry,
} from 'hyperview/src/types';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { NODE_TYPE } from 'hyperview/src/types';

import MaxLengthValidator from 'hyperview/src/validators/max-length';
import MaxValueValidator from 'hyperview/src/validators/max-length';
import MinLengthValidator from 'hyperview/src/validators/min-length';
import MinValueValidator from 'hyperview/src/validators/max-length';
import RequiredValidator from 'hyperview/src/validators/required';

const VALIDATORS = [
  MaxLengthValidator,
  MaxValueValidator,
  MinLengthValidator,
  MinValueValidator,
  RequiredValidator,
];

export const REGISTRY: ValidatorRegistry = {};

VALIDATORS.forEach(v => {
  const namespaceDict = REGISTRY[v.namespace] || {};
  namespaceDict[v.name] = v;
  REGISTRY[v.namespace] = namespaceDict;
});

export const getValidators = (
  element: Element,
): Array<[Validator, Element]> => {
  const children: Array<any> = Array.from(element.childNodes || []);
  const elementChildren: Array<Element> = children.filter(
    n => n.nodeType === NODE_TYPE.ELEMENT_NODE,
  );

  return elementChildren.reduce(
    (validators: Array<[Validator, Element]>, e: Element) => {
      const namespace = e.namespaceURI ? REGISTRY[e.namespaceURI] || {} : {};
      const validator: Validator | null = e.localName ? namespace[e.localName] : null;
      if (validator) {
        const tuple = [validator, e];
        return [...validators, tuple];
      }
      return validators;
    },
    [],
  );
};

export const getValidatorElementsWithInvalidState = (
  element: Element,
): Array<Element> => {
  return (
    getValidators(element)
      // eslint-disable-next-line no-unused-vars
      .map(([v, e]) => e)
      .filter((e: Element) => {
        return e.getAttributeNS(Namespaces.HYPERVIEW_VALIDATION, 'state') === 'invalid';
      })
  );
};

export const getValidationSource = (element: Element): string | null => {
  return element.getAttributeNS(Namespaces.HYPERVIEW_VALIDATION, 'source');
};

export const getValidationState = (element: Element): string | null => {
  const state: string | null = element.getAttributeNS(Namespaces.HYPERVIEW_VALIDATION, 'state');
  if (state) {
    // Explicit state defined on the element
    return state;
  }

  // If the element has a "source" attribute, use the validation state of the source element.
  const sourceId: string | null = getValidationSource(element);
  if (sourceId !== null && sourceId !== undefined) {
    const doc: Document | null = DomService.getDocument(element);
    const sourceElement: Element | null = doc ? doc.getElementById(sourceId) : null;
    return sourceElement ? sourceElement.getAttributeNS(Namespaces.HYPERVIEW_VALIDATION, 'state') : null;
  }

  return null;
};

export const getValidationRoles = (element: Element): Array<string> => {
  const role: string = element.getAttributeNS(Namespaces.HYPERVIEW_VALIDATION, 'role') || '';
  return Xml.splitAttributeList(role);
};

export const hasValidationRole = (element: Element, role: string): boolean => {
  return getValidationRoles(element).indexOf(role) >= 0;
};
