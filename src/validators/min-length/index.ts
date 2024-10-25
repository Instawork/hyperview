import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { SingleValueValidator, Validation } from 'hyperview/src/types';

const invalid = (element: Element): Validation => ({
  message: element.getAttribute('message') || 'This field has bad length',
  valid: false,
});

export default {
  kind: 'single',
  check: (value: string | null | undefined, element: Element): Validation => {
    const minLengthStr: string | null = element.getAttribute('min');
    const minLength = parseInt(minLengthStr || '', 10);
    if (Number.isNaN(minLength)) {
      Logging.warn(
        `[validators/min-length]: invalid min attribute of "${minLengthStr}"`,
      );
      return invalid(element);
    }

    if (value !== null) {
      const valueLength: number = value ? value.length : 0;
      if (valueLength < minLength) {
        return invalid(element);
      }
    }

    return { valid: true };
  },
  name: 'min-length',
  namespace: Namespaces.HYPERVIEW_VALIDATION,
} as SingleValueValidator;
