import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { SingleValueValidator, Validation } from 'hyperview/src/types';

export default {
  check: (value: string | null | undefined, element: Element): Validation => {
    const maxValueStr: string | null = element.getAttribute('max');
    const maxValue = parseFloat(maxValueStr || '');
    if (Number.isNaN(maxValue)) {
      Logging.warn(
        `[validators/max-value]: invalid value attribute of ${maxValueStr}`,
      );
    }

    const parsedValue = parseFloat(value || '');
    if (!Number.isNaN(parsedValue)) {
      if (parsedValue > maxValue) {
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
} as SingleValueValidator;
