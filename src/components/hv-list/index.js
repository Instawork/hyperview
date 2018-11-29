// @flow

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type { Props, State } from './types';
import React, { PureComponent } from 'react';
import { DOMParser } from 'xmldom';
import { FlatList } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getBehaviorElements } from 'hyperview/src/services';

export default class HvList extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.LIST;
  parser: DOMParser = new DOMParser();
  props: Props;
  state: State = {
    refreshing: false,
  };

  refresh = () => {
    const { element, onUpdate } = this.props;
    this.setState({ refreshing: true });

    getBehaviorElements(element)
      .filter(e => e.getAttribute('trigger') === 'refresh')
      .forEach((e, i) => {
        const path = e.getAttribute('href');
        const action = e.getAttribute('action') || 'append';
        const targetId = e.getAttribute('target');
        const showIndicatorIds = e.getAttribute('show-during-load');
        const hideIndicatorIds = e.getAttribute('hide-during-load');
        const delay = e.getAttribute('delay');
        const once = e.getAttribute('once');
        const onEnd = i === 0 ? () => this.setState({ refreshing: false }) : null;
        onUpdate(path, action, element, {
          targetId,
          showIndicatorIds,
          hideIndicatorIds,
          delay,
          once,
          onEnd,
          behaviorElement: e,
        });
      });
  }

  render() {
    const { refreshing } = this.state;
    const { element, stylesheets, animations, onUpdate, options } = this.props;
    const styleAttr = element.getAttribute('style');
    const style = styleAttr ? styleAttr.split(' ').map(s => stylesheets.regular[s]) : null;

    const listProps = {
      style,
      // $FlowFixMe: see node_modules/react-native/Libraries/Lists/FlatList.js:73
      data: element.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'item'),
      keyExtractor: item => item.getAttribute('key'),
      // $FlowFixMe: return value should be of ?React.Element<any>
      renderItem: ({ item }) =>
        Render.renderElement(item, stylesheets, animations, onUpdate, options),
    };

    let refreshProps = {};
    if (element.getAttribute('trigger') === 'refresh') {
      refreshProps = {
        onRefresh: () => {
          this.refresh();
        },
        refreshing,
      };
    }

    return React.createElement(
      FlatList, {
        ...listProps,
        ...refreshProps,
      },
    );
  }
}
