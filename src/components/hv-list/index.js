// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import React, { PureComponent } from 'react';
import { DOMParser } from 'xmldom-instawork';
import { FlatList } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { State } from './types';

export default class HvList extends PureComponent<HvComponentProps, State> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.LIST;

  static localNameAliases = [];

  parser: DOMParser = new DOMParser();

  props: HvComponentProps;

  state: State = {
    refreshing: false,
  };

  refresh = () => {
    this.setState({ refreshing: true });

    Dom.getBehaviorElements(this.props.element)
      .filter(e => e.getAttribute('trigger') === 'refresh')
      .forEach((e, i) => {
        const path = e.getAttribute('href');
        const action = e.getAttribute('action') || 'append';
        const targetId = e.getAttribute('target');
        const showIndicatorIds = e.getAttribute('show-during-load');
        const hideIndicatorIds = e.getAttribute('hide-during-load');
        const delay = e.getAttribute('delay');
        const once = e.getAttribute('once');
        const onEnd =
          i === 0 ? () => this.setState({ refreshing: false }) : null;
        this.props.onUpdate(path, action, this.props.element, {
          behaviorElement: e,
          delay,
          hideIndicatorIds,
          once,
          onEnd,
          showIndicatorIds,
          targetId,
        });
      });
  };

  render() {
    const styleAttr = this.props.element.getAttribute('style');
    const style = styleAttr
      ? styleAttr.split(' ').map(s => this.props.stylesheets.regular[s])
      : null;

    const horizontal =
      this.props.element.getAttribute('scroll-orientation') === 'horizontal';
    const showScrollIndicator =
      this.props.element.getAttribute('shows-scroll-indicator') !== 'false';

    const data = Array.from(
      this.props.element
        // $FlowFixMe: this.props.element is an Element, not a Node
        .getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.ITEM),
    ).filter(
      item =>
        item.parentNode === this.props.element ||
        (item.parentNode.tagName === LOCAL_NAME.ITEMS &&
          item.parentNode.namespaceURI === Namespaces.HYPERVIEW &&
          item.parentNode.parentNode === this.props.element),
    );

    const listProps = {
      data,
      horizontal,
      keyExtractor: item => item && item.getAttribute('key'),
      renderItem: ({ item }) =>
        item &&
        Render.renderElement(
          item,
          this.props.stylesheets,
          this.props.onUpdate,
          this.props.options,
        ),
      showsHorizontalScrollIndicator: horizontal && showScrollIndicator,
      showsVerticalScrollIndicator: !horizontal && showScrollIndicator,
      style,
    };

    let refreshProps = {};
    if (this.props.element.getAttribute('trigger') === 'refresh') {
      refreshProps = {
        onRefresh: () => {
          this.refresh();
        },
        refreshing: this.state.refreshing,
      };
    }

    // $FlowFixMe
    return React.createElement(FlatList, {
      ...listProps,
      ...refreshProps,
    });
  }
}
