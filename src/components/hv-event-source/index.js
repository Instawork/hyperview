// @flow

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import React, { PureComponent } from 'react';
import type { Props } from './types';
import type { DOMString } from 'hyperview/src/types';
import RNEventSource from 'react-native-event-source';

export const EventSourceContext = React.createContext('event-source');

export default class HvEventSource extends PureComponent<Props> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = 'event-source';
  props: Props;

  eventSource = null;

  constructor(props: Props) {
    super(props);
    this.eventSource = null;
  }

  componentDidMount() {
    const { element } = this.props;
    const host: ?DOMString = element.getAttribute('src');
    const options = {};
    const authorizationHeader: ?DOMString = element.getAttribute(
      'authorization',
    );
    if (authorizationHeader) {
      options['headers'] = {
        Authorization: authorizationHeader,
      };
    }
    this.eventSource = new RNEventSource(host, options);

    this.eventObject = {
      registerEvents: events => registerEvents(events),
    };
  }

  registerEvents(events) {
    events.forEach(e =>
      this.eventSource.addEventListener(e, () => console.log('GOT EVENT: ', e)),
    );
  }

  componentWillUnmount() {
    if (this.eventSource) {
      this.eventSource.removeAllListeners();
      this.eventSource.close();
    }
  }

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;
    return (
      <EventSourceContext.Provider value={this.eventSource}>
        {...Render.renderChildren(element, stylesheets, onUpdate, options)}
      </EventSourceContext.Provider>
    );
  }
}
