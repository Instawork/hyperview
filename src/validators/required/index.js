import type {
  Element,
  Validator,
  Validation,
} from 'hyperview/src/types';
import { HYPERVIEW_VALIDATION } from 'hyperview/src/services/namespaces';

export default {
  namespace: HYPERVIEW_VALIDATION,
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
