import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  Element,
  Validation,
  Validator,
} from 'hyperview/src/services/types';

const MaxValueValidator: Validator = {
  check: (value: string | null | undefined, element: Element): Validation => {
    const max = parseFloat(element.getAttribute('max'));

    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      if (parsedValue > max) {
        return {
          message:
            element.getAttribute('message') || 'This field has bad value',
          valid: false,
        };
      }
    }

    return { valid: true };
  },
  name: 'max-value',
  namespace: Namespaces.HYPERVIEW_VALIDATION,
};
