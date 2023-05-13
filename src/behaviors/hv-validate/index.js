// @flow

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as ValidationService from 'hyperview/src/services/validation';
import type {
  Document,
  Element,
  HvBehaviorOptions,
  HvComponentOnUpdate,
  HvFormValues,
  NamespaceURI,
  Validation,
  Validator,
} from 'hyperview/src/types';

const setValidationMessages = (
  sourceId: string,
  message: ?string,
  onUpdate: HvComponentOnUpdate,
  root: Document,
) => {
  const elements: Array<any> = Array.from(
    root.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'text'),
  );
  elements
    .filter((e: Element) => {
      const source: ?string = e.getAttributeNS(
        ValidationService.V_NS,
        'source',
      );
      return (
        ValidationService.hasValidationRole(e, 'message') && source === sourceId
      );
    })
    .forEach((e: Element) => {
      const newElement: Element = e.cloneNode(false);
      newElement.appendChild(root.createTextNode(message || ''));
      onUpdate(null, 'swap', e, { newElement });
    });
};

export default {
  action: 'validate',
  callbackWithOptions: (element: Element, options: HvBehaviorOptions) => {
    const { onUpdate, getRoot, componentRegistry } = options;

    const inputId: ?string = element.getAttribute('target');
    const inputElement: ?Element = inputId
      ? getRoot().getElementById(inputId)
      : element;
    if (!inputElement) {
      // The target of the behavior does not exist, nothing to do.
      return;
    }

    const {
      namespaceURI,
      localName,
    }: { +namespaceURI: ?NamespaceURI, +localName: ?string } = inputElement;
    if (namespaceURI === undefined || namespaceURI === null) {
      return;
    }

    if (localName === undefined || localName === null) {
      return;
    }

    const component =
      componentRegistry[namespaceURI] &&
      componentRegistry[namespaceURI][localName];

    if (
      component &&
      !Object.prototype.hasOwnProperty.call(component, 'getFormInputValues')
    ) {
      // The target of the behavior is not a form input element, nothing to do.
      return;
    }

    // Get form input values from the element.
    const formComponent: HvFormValues = (component: any);
    const values: Array<string> = formComponent
      .getFormInputValues(inputElement)
      // eslint-disable-next-line no-unused-vars
      .map(([name: string, value: string]) => value);

    // Find validators for the element
    const validators: Array<
      [Validator, Element],
    > = ValidationService.getValidators(inputElement);

    // For each validator, collect the results on each value.
    const validationResults: Array<Validation> = validators.reduce(
      (allResults: Array<Validation>, [v: Validator, e: Element]) => {
        // For a single validator, collect the results on each value
        const validatorResults = values.reduce(
          (results: Array<Validation>, value: string) => {
            // Get the results of a single validaor for a single value.
            const result: Validation = v.check(value, e);

            e.setAttributeNS(
              ValidationService.V_NS,
              'state',
              result.valid ? 'valid' : 'invalid',
            );

            // Combine all results
            return [...results, result];
          },
          [],
        );

        return [...allResults, ...validatorResults];
      },
      [],
    );

    const inputElementId: ?string = inputElement.getAttribute('id');
    if (!inputElementId) {
      // If the input being validated does not have an ID, then there's no reference from text elements
      // displaying the validation message. So we can short-circuit and return early.
      return;
    }

    // Find first invalid result.
    const invalid: ?Validation = validationResults.find(v => !v.valid);
    const message: ?string = invalid ? invalid.message : null;
    setValidationMessages(inputElementId, message, onUpdate, getRoot());

    inputElement.setAttributeNS(
      ValidationService.V_NS,
      'state',
      invalid ? 'invalid' : 'valid',
    );
    onUpdate(null, 'swap', inputElement, {
      newElement: inputElement.cloneNode(true),
    });
  },
};
