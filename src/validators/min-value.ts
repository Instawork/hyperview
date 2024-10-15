import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  Element,
  Validation,
  Validator,
} from 'hyperview/src/services/types';

const MinValueValidator: Validator = {
  check: (value: string | null | undefined, element: Element): Validation => {
    const min = parseFloat(element.getAttribute('min'));

    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      if (parsedValue < min) {
        return {
          message:
            element.getAttribute('message') || 'This field has bad value',
          valid: false,
        };
      }
    }

    return { valid: true };
  },
  name: 'min-value',
  namespace: Namespaces.HYPERVIEW_VALIDATION,
};
