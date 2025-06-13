import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { HvComponentOptions, LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';

/**
 * Provides a random UUID string.
 * @returns {string}
 */
export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

/**
 * Provides a random UUID number.
 * @returns {number}
 */
export const uuidNumber = (): number => {
  return parseInt(uuid().replace(/-/g, ''), 16);
};

/**
 * Checks if an element should be rendered based on the element type and options
 * Logging warnings for unexpected conditions
 * @param {Element} element
 * @param {HvComponentOptions} options
 * @param {InlineContext} inlineFormattingContext
 * @returns {boolean}
 */
export const isRenderableElement = (
  element: Element,
  options: HvComponentOptions,
  inlineFormattingContext: [Node[], string[]] | null | undefined,
): boolean => {
  if (!element) {
    return false;
  }
  if (
    element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    element.getAttribute('hide') === 'true'
  ) {
    // Hidden elements don't get rendered
    return false;
  }
  if (element.nodeType === NODE_TYPE.COMMENT_NODE) {
    // XML comments don't get rendered.
    return false;
  }
  if (
    element.nodeType === NODE_TYPE.ELEMENT_NODE &&
    element.namespaceURI === Namespaces.HYPERVIEW
  ) {
    switch (element.localName) {
      case LOCAL_NAME.BEHAVIOR:
      case LOCAL_NAME.MODIFIER:
      case LOCAL_NAME.STYLES:
      case LOCAL_NAME.STYLE:
        // Non-UI elements don't get rendered
        return false;
      default:
        break;
    }
  }

  if (element.nodeType === NODE_TYPE.ELEMENT_NODE) {
    if (!element.namespaceURI) {
      Logging.warn('`namespaceURI` missing for node:', element.toString());
      return false;
    }
    if (!element.localName) {
      Logging.warn('`localName` missing for node:', element.toString());
      return false;
    }

    if (
      options.componentRegistry?.getComponent(
        element.namespaceURI,
        element.localName,
      )
    ) {
      // Has a component registered for the namespace/local name.
      return true;
    }
    // No component registered for the namespace/local name.
    // Warn in case this was an unintended mistake.
    Logging.warn(
      `No component registered for tag <${element.localName}> (namespace: ${element.namespaceURI})`,
    );
  }

  if (element.nodeType === NODE_TYPE.TEXT_NODE) {
    // Render non-empty text nodes, when wrapped inside a <text> element
    if (element.nodeValue) {
      if (
        ((element.parentNode as Element)?.namespaceURI ===
          Namespaces.HYPERVIEW &&
          (element.parentNode as Element)?.localName === LOCAL_NAME.TEXT) ||
        (element.parentNode as Element)?.namespaceURI !== Namespaces.HYPERVIEW
      ) {
        if (options.preformatted) {
          return true;
        }
        // When inline formatting context exists, lookup formatted value using node's index.
        if (inlineFormattingContext) {
          return true;
        }
      }
    }
  }

  if (element.nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
    return true;
  }
  return false;
};

/**
 * Wrapper to handle UI events
 * Stop propagation and prevent default client behavior
 * This prevents clicks on various elements to trigger browser navigation
 * when using Hyperview for web.
 */
export const createEventHandler = (
  handler: () => void,
  preventDefault = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ((event?: any) => void) => event => {
  if (preventDefault) {
    event?.preventDefault();
  }
  handler();
};
