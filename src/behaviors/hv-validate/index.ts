import * as Components from 'hyperview/src/services/components';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as ValidationService from 'hyperview/src/services/validation';
import type {
  HvComponent,
  HvComponentOnUpdate,
  HvFormValues,
  HvGetRoot,
  HvUpdateRoot,
  NamespaceURI,
  Validation,
  Validator,
} from 'hyperview/src/types';

const setValidationMessages = (
  sourceId: string,
  message: string | null | undefined,
  onUpdate: HvComponentOnUpdate,
  root: Document,
) => {
  const elements: Array<Element> = Array.from(
    root.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'text'),
  );
  elements
    .filter((e: Element) => {
      const source: string | null = e.getAttributeNS(
        Namespaces.HYPERVIEW_VALIDATION,
        'source',
      );
      return (
        ValidationService.hasValidationRole(e, 'message') && source === sourceId
      );
    })
    .forEach((e: Element) => {
      const newElement: Element = e.cloneNode(false) as Element;
      newElement.appendChild(root.createTextNode(message || ''));
      onUpdate(null, 'swap', e, { newElement });
    });
};

export default {
  action: 'validate',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
    registry: Components.Registry,
  ) => {
    const inputId: string | null = element.getAttribute('target');
    const inputElement: Element | null | undefined = inputId
      ? getRoot()?.getElementById(inputId)
      : element;
    if (!inputElement) {
      // The target of the behavior does not exist, nothing to do.
      return;
    }

    const {
      namespaceURI,
      localName,
    }: {
      namespaceURI: NamespaceURI | null | undefined;
      localName: string | null;
    } = inputElement;
    if (namespaceURI === undefined || namespaceURI === null) {
      return;
    }

    if (localName === undefined || localName === null) {
      return;
    }

    if (!registry.hasFormComponent(namespaceURI, localName)) {
      // The target of the behavior is not a form input element, nothing to do.
      return;
    }

    // Get form input values from the element.
    const formComponent: HvFormValues = registry.getComponent(
      namespaceURI,
      localName,
    ) as HvComponent & HvFormValues;
    const values: Array<[string, string]> = formComponent.getFormInputValues(
      inputElement,
    );

    // Find validators for the element
    const validators: Array<
      [Validator, Element]
    > = ValidationService.getValidators(inputElement);

    const validationResults: Array<Validation> = validators.reduce(
      (allResults: Array<Validation>, [v, e]) => {
        let validatorResults: Array<Validation> = [];

        switch (v.kind) {
          case 'single': {
            // For a single validator, collect the results on each value
            validatorResults = values
              .map(([, value]) => value)
              .reduce((results: Array<Validation>, value: string) => {
                // Get the results of a single validaor for a single value.
                const result: Validation = v.check(value, e);
                // Update state of the validator element
                e.setAttributeNS(
                  Namespaces.HYPERVIEW_VALIDATION,
                  'state',
                  result.valid ? 'valid' : 'invalid',
                );
                // Combine all results
                return [...results, result];
              }, []);
            break;
          }
          case 'multiple': {
            // A multiple-value validator will be run once on all values.
            const result: Validation = v.checkMultiple(values, e);
            // Update state of the validator element
            e.setAttributeNS(
              Namespaces.HYPERVIEW_VALIDATION,
              'state',
              result.valid ? 'valid' : 'invalid',
            );
            validatorResults = [result];
            break;
          }
          default:
            break;
        }

        return [...allResults, ...validatorResults];
      },
      [],
    );

    const inputElementId: string | null = inputElement.getAttribute('id');
    if (!inputElementId) {
      // If the input being validated does not have an ID,
      // then there's no reference from text elements displaying the validation message.
      // So we can short-circuit and return early.
      return;
    }

    // Find first invalid result.
    const invalid: Validation | null | undefined = validationResults.find(
      v => !v.valid,
    );
    const message: string | null | undefined = invalid ? invalid.message : null;
    const root: Document | null = getRoot();
    if (root) {
      setValidationMessages(inputElementId, message, onUpdate, root);
    } else {
      Logging.warn(
        '[behaviors/validate]: root document not found to set validation messages.',
      );
    }

    inputElement.setAttributeNS(
      Namespaces.HYPERVIEW_VALIDATION,
      'state',
      invalid ? 'invalid' : 'valid',
    );
    onUpdate(null, 'swap', inputElement, {
      newElement: inputElement.cloneNode(true) as Element,
    });
  },
};
