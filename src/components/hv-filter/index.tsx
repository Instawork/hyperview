import * as Render from 'hyperview/src/services/render';
import * as Events from 'hyperview/src/services/events';
import * as Components from 'hyperview/src/services/components';
import React, { PureComponent } from 'react';
import * as Services from 'hyperview/src/services';
import { NODE_TYPE }from 'hyperview/src/types';

FILTER_NS = 'https://hyperview.org/filter';

export default class FilterContainer extends PureComponent<HvComponentProps> {
  static namespaceURI = FILTER_NS;

  static localName = "container"

  constructor(props: HvComponentProps) {
    super(props);
    const components = Object.values(this.props.options.componentRegistry).reduce((acc, value) => {
      acc.push(...Object.values(value));
      return acc;
    }, [])
    this.formComponentRegistry = Components.getFormRegistry(components);
  }

  componentDidMount() {
    Events.subscribe(this.onEventDispatch);
  }

  componentWillUnmount() {
    Events.unsubscribe(this.onEventDispatch);
  }

  onEventDispatch = (eventName: string) => {
    const filterEvent = this.props.element.getAttribute('on-event') || '';
    const filterParam = this.props.element.getAttribute('on-param');
    if (filterEvent !== eventName) {
      return;
    }
    if (!filterParam) {
      return;
    }

    const transformFlags: string[] = (this.props.element.getAttribute('transform') || '').split(',');
    const forceLowerCase: bool = transformFlags.includes('lowercase');

    const formData: FormData | null | undefined = Services.getFormData(this.props.element, this.formComponentRegistry);
    const filterTerm = formData["_parts"][0][1];
    const transformedFilterTerm = forceLowerCase ? filterTerm.toLowerCase() : filterTerm;

    // Hide/show each element with filter terms. Modify attributes in-place
    const filterElements: Element[] = this.findFilterElements(this.props.element);
    filterElements.forEach((element: Element) => {
      const terms: string = element.getAttributeNS(FILTER_NS, 'terms') || '';
      const termsArray: string[] = terms
        .split(',')
        .map((term: string) => forceLowerCase ? term.toLowerCase() : term);
      const showElement: bool = termsArray
        .some((term: string) => term.startsWith(transformedFilterTerm));
      element.setAttribute("hide", showElement ? "false" : "true");
    });

    // Clone/swap the entire element to swap in the visibility changes
    const newElement = this.props.element.cloneNode(true) as Element;
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  }

  findFilterElements = (node: Element) => {
    if (node.nodeType != NODE_TYPE.ELEMENT_NODE) {
      return [];
    }

    if (node.getAttributeNS(FILTER_NS, 'terms')) {
      return [node];
    }

    return Array.from(node.childNodes).filter((child: Node | null) => {
      return child !== null && child.nodeType === NODE_TYPE.ELEMENT_NODE;
    }).reduce((elements: Element[], child: Element) => {
        elements.push(...this.findFilterElements(child));
        return elements;
    }, []);
  }

  render() {
    return Render.renderChildren(this.props.element, this.props.stylesheets, this.props.onUpdate, this.props.options);
  }

}
