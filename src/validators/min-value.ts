import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { SingleValueValidator, Validation } from 'hyperview/src/types';

export default {
  check: (value: string | null | undefined, element: Element): Validation => {
    const minValueStr: string | null = element.getAttribute('min');
    const minValue = parseFloat(minValueStr || '');
    if (Number.isNaN(minValue)) {
      Logging.warn(
        `[validators/min-value]: invalid value attribute of ${minValueStr}`,
      );
    }

    const parsedValue = parseFloat(value || '');
    if (!Number.isNaN(parsedValue)) {
      if (parsedValue < minValue) {
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
} as SingleValueValidator;
