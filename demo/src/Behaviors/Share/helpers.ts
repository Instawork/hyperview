import type { Content, Options } from './types';
import type { DOMString } from 'hyperview';

export const getOptions = (
  dialogTitle?: DOMString | null,
  subject?: DOMString | null,
): Options => {
  if (dialogTitle) {
    if (subject) {
      return { dialogTitle, subject };
    }
    return { dialogTitle };
  }
  return {};
};

export const getContent = (
  message?: DOMString | null,
  title?: DOMString | null,
  url?: DOMString | null,
): Content | null | undefined => {
  if (message) {
    if (title && url) {
      return { message, title, url };
    }
    if (title) {
      return { message, title };
    }
    if (url) {
      return { message, url };
    }
    return { message };
  }
  if (url) {
    if (title) {
      return { title, url };
    }
    return { url };
  }
  return null;
};
