import * as Namespaces from 'hyperview/src/services/namespaces';
import type { SingleValueValidator, Validation } from 'hyperview/src/types';

export default {
  check: (value: string | null | undefined, element: Element): Validation => {
    if (value) {
      return {
        valid: true,
      };
    }
    return {
      message: element.getAttribute('message') || 'This field is required',
      valid: false,
    };
  },
  name: 'required',
  namespace: Namespaces.HYPERVIEW_VALIDATION,
} as SingleValueValidator;
