import * as Logging from 'hyperview/src/services/logging';
import type { HvComponentProps, LocalName } from 'hyperview';
import Hyperview, {
  Events,
  LOCAL_NAME,
  NODE_TYPE,
  Namespaces,
} from 'hyperview';
import { useEffect } from 'react';

type FormDataPart = {
  fieldName: string;
  string: string;
};

declare class FormData {
  getParts(): Array<FormDataPart>;
}
const FILTER_NS = 'https://hyperview.org/filter';

export const findElements = (node: Element, attributeNames: string[]) => {
  if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
    return [];
  }

  if (
    attributeNames.reduce(
      (found, name) => found || !!node.getAttributeNS(FILTER_NS, name),
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
      elements.push(...findElements(child, attributeNames));
      return elements;
    }, []);
};

const Filter = (props: HvComponentProps) => {
  const onEventDispatch = (eventName: string) => {
    const filterEvent =
      props.element.getAttributeNS(FILTER_NS, 'on-event') || '';
    if (filterEvent !== eventName) {
      return;
    }
    const filterParam = props.element.getAttributeNS(FILTER_NS, 'on-param');
    if (!filterParam) {
      return;
    }

    const transformFlags: string[] = (
      props.element.getAttributeNS(FILTER_NS, 'transform') || ''
    ).split(',');
    const forceLowerCase: boolean = transformFlags.includes('lowercase');

    const formData: FormData | null = props.options.componentRegistry
      ? ((props.options.componentRegistry.getFormData(
          props.element,
        ) as unknown) as FormData)
      : null;

    const formPart: FormDataPart | undefined = formData
      ?.getParts()
      .find(part => part.fieldName === filterParam);
    const filterTerm = formPart ? formPart.string : '';
    const transformedFilterTerm = forceLowerCase
      ? filterTerm.toLowerCase()
      : filterTerm;

    // Hide/show each element with filter terms or matching given regex. Modify attributes in-place
    const filterElements: Element[] = findElements(props.element, [
      'terms',
      'regex',
    ]);
    filterElements.forEach((element: Element) => {
      const terms: string = element.getAttributeNS(FILTER_NS, 'terms') || '';
      const regex: string | null =
        element.getAttributeNS(FILTER_NS, 'regex') || null;
      const termsArray: string[] = terms
        .split(',')
        .map((term: string) => (forceLowerCase ? term.toLowerCase() : term));
      const showElement = (): boolean => {
        if (regex) {
          return new RegExp(regex).test(filterTerm);
        }
        return termsArray.some((term: string) =>
          term.startsWith(transformedFilterTerm),
        );
      };
      element.setAttribute('hide', String(!showElement()));
    });

    // Clone/swap the entire element to swap in the visibility changes
    const newElement = props.element.cloneNode(true) as Element;
    props.onUpdate(null, 'swap', props.element, { newElement });

    // Set elements that need to render the filter term
    findElements(newElement, ['role']).forEach((element: Element) => {
      if (element.getAttributeNS(FILTER_NS, 'role') === 'filter-terms') {
        if (
          element.namespaceURI === Namespaces.HYPERVIEW &&
          element.localName !== LOCAL_NAME.TEXT
        ) {
          Logging.error(
            'Element with attribute `role="filter-terms"` should be a <text> element or a custom element',
          );
          return;
        }
        const newRoleElement = element.cloneNode(true) as Element;
        newRoleElement.textContent = filterTerm;
        props.onUpdate(null, 'swap', element, { newElement: newRoleElement });
      }
    });
  };

  useEffect(() => {
    Events.subscribe(onEventDispatch);
    return () => {
      Events.unsubscribe(onEventDispatch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.element]);

  return (Hyperview.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  ) as unknown) as JSX.Element;
};

Filter.namespaceURI = FILTER_NS;
Filter.localName = 'container' as LocalName;
Filter.localNameAliases = [] as LocalName[];

export { Filter };
