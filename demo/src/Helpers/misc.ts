import { NODE_TYPE } from 'hyperview';
import moment from 'moment';

export const formatDate = (
  date: Date | null | undefined,
  format: string | undefined,
) => moment(date).format(format);

export const fetchWrapper = (
  input: RequestInfo | URL,
  init: RequestInit | undefined = { headers: {} },
): Promise<Response> => {
  return fetch(input, {
    ...init,
    headers: {
      // Don't cache requests for the demo
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Expires: '0',
      Pragma: 'no-cache',
      ...init.headers,
    },
    mode: 'cors',
  });
};

export const findElements = (
  namespace: string,
  node: Element,
  attributeNames: string[],
) => {
  if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
    return [];
  }

  if (
    attributeNames.reduce(
      (found, name) => found || !!node.getAttributeNS(namespace, name),
      false,
    )
  ) {
    return [node];
  }

  return (Array.from(node.childNodes) as Element[])
    .filter((child: Node | null) => {
      return child !== null && child.nodeType === NODE_TYPE.ELEMENT_NODE;
    })
    .reduce((elements: Element[], child: Element) => {
      elements.push(...findElements(namespace, child, attributeNames));
      return elements;
    }, []);
};
