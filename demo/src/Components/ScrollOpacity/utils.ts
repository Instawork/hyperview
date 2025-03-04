export const namespaceURI = 'https://hyperview.org/scroll-opacity';

export const getNumberAttr = (
  element: Element,
  attrName: string,
  defaultValue: number | null = null,
): number => {
  const value: string | null = element.getAttributeNS(namespaceURI, attrName);
  if (!value) {
    return defaultValue || 0;
  }
  return parseInt(value, 10);
};
