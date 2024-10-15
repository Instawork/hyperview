import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  Element,
  Validation,
  Validator,
} from 'hyperview/src/services/types';

export default {
  check: (value: string | null | undefined, element: Element): Validation => {
    const minLength = parseInt(element.getAttribute('min'), 10);

    if (value !== null) {
      const valueLength: number = value ? value.length : 0;
      if (valueLength < minLength) {
        return {
          message:
            element.getAttribute('message') || 'This field has bad length',
          valid: false,
        };
      }
    }

    return { valid: true };
  },
  name: 'min-length',
  namespace: Namespaces.HYPERVIEW_VALIDATION,
};
