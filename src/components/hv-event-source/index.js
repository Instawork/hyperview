// @flow

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import React, { PureComponent } from 'react';
import type { Props } from './types';
import type { DOMString } from 'hyperview/src/types';
import RNEventSource from 'react-native-event-source';
import eventEmitter from 'tiny-emitter/instance';
import { ON_EVENT_DISPATCH } from 'hyperview/src/types';

export const EventSourceContext = React.createContext();

export default class HvEventSource extends PureComponent<Props> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = 'event-source';
  props: Props;

  eventSource = null;

  constructor(props: Props) {
    super(props);
    this.eventSource = null;
  }

  componentWillMount() {
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
      registerEvents: events => this.registerEvents(events),
    };
  }

  registerEvents(events) {
    events.forEach(e => {
      if (this.eventSource) {
        this.eventSource.addEventListener(e, () => {
          eventEmitter.emit(ON_EVENT_DISPATCH, e);
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.eventSource) {
      this.eventSource.removeAllListeners();
      this.eventSource.close();
    }
  }

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;
    return React.createElement(
      EventSourceContext.Provider,
      { value: this.eventObject },
      ...Render.renderChildren(element, stylesheets, onUpdate, options),
    );
  }
}
