import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  SingleValueValidator,
  Validation,
} from 'hyperview/src/types';
import * as Logging from 'hyperview/src/services/logging';

const MinValueValidator = {
  check: (value: string | null | undefined, element: Element): Validation => {
    const minValueStr: string | null = element.getAttribute('min');
    const minValue = parseFloat(minValueStr || '');
    if (isNaN(minValue)) {
      Logging.warn(`[validators/min-value]: invalid value attribute of ${minValueStr}`);
    }

    const parsedValue = parseFloat(value || '');
    if (!isNaN(parsedValue)) {
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
