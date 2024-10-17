import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { SingleValueValidator, Validation } from 'hyperview/src/types';

export default {
  kind: 'single',
  check: (value: string | null | undefined, element: Element): Validation => {
    if (value === null || value === undefined || value === '') {
      return { valid: true };
    }
    const minValueStr: string | null = element.getAttribute('min');
    const minValue = parseFloat(minValueStr || '');
    if (Number.isNaN(minValue)) {
      Logging.warn(
        `[validators/min-value]: invalid min attribute of "${minValueStr}"`,
      );
    }

    const parsedValue = parseFloat(value || '');
    if (Number.isNaN(parsedValue)) {
      Logging.warn(`[validators/min-value]: invalid value of "${value}"`);
    }

    if (parsedValue >= minValue) {
      return { valid: true };
    }

    return {
      message: element.getAttribute('message') || 'This field has bad value',
      valid: false,
    };
  },
  name: 'min-value',
  namespace: Namespaces.HYPERVIEW_VALIDATION,
} as SingleValueValidator;
