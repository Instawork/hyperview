export const namespaceURI = 'https://hyperview.org/scroll-opacity';

export const getNumberAttr = (
  element: Element,
  attrName: string,
  defaultValue: number,
): number => {
  const value: string | null = element.getAttributeNS(namespaceURI, attrName);
  if (!value) {
    return defaultValue;
  }
  return parseInt(value, 10);
};

export const getRangeAttr = (
  element: Element,
  attrName: string,
  defaultValue: [number, number],
): [number, number] => {
  const value: string | null = element.getAttributeNS(namespaceURI, attrName);
  if (!value) {
    return defaultValue;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    throw new Error(`Invalid range attribute: ${value}`);
  }
};

export const calculateOpacity = (
  position: number,
  inputRange: [number, number],
  outputRange: [number, number],
) => {
  const [a, b] = inputRange;
  const [c, d] = outputRange;

  // Check if the input range has the same start and end values
  if (a === b) {
    // If the position is exactly at a (or b), return the start of the output range
    // Otherwise, return the end of the output range
    return position <= a ? c : d;
  }

  // Calculate the slope
  const slope = (d - c) / (b - a);

  // Calculate the opacity based on the position
  if (position < a) {
    return c;
  }
  if (position > b) {
    return d;
  }
  return c + slope * (position - a);
};
