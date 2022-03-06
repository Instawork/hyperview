import type {
  Element,
  Validator,
  Validation,
} from 'hyperview/src/types';
import { HYPERVIEW_VALIDATION } from 'hyperview/src/services/namespaces';

export default {
  namespace: HYPERVIEW_VALIDATION,
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


