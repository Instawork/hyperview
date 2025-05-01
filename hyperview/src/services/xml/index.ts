/**
 * Splits a string by any whitespace and returns an array
 * containing only the non-whitespace tokens.
 */
export const splitAttributeList = (attr: string): Array<string> =>
  attr.match(/\S+/g) || [];
