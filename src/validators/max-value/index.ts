import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { SingleValueValidator, Validation } from 'hyperview/src/types';

export default {
  kind: 'single',
  check: (value: string | null | undefined, element: Element): Validation => {
    if (value === null || value === undefined || value === '') {
      return { valid: true };
    }
    const maxValueStr: string | null = element.getAttribute('max');
    const maxValue = parseFloat(maxValueStr || '');
    if (Number.isNaN(maxValue)) {
      Logging.warn(
        `[validators/max-value]: invalid max attribute of "${maxValueStr}"`,
      );
    }

    const parsedValue = parseFloat(value || '');
    if (Number.isNaN(parsedValue)) {
      Logging.warn(`[validators/max-value]: invalid value of "${value}"`);
    }

    if (parsedValue <= maxValue) {
      return { valid: true };
    }

    return {
      message: element.getAttribute('message') || 'This field has bad value',
      valid: false,
    };
  },
  name: 'max-value',
  namespace: Namespaces.HYPERVIEW_VALIDATION,
} as SingleValueValidator;
