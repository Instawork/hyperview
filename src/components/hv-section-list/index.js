// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import React, { PureComponent } from 'react';
import { DOMParser } from 'xmldom-instawork';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { SectionList } from 'react-native';
import type { State } from './types';

export default class HvSectionList extends PureComponent<
  HvComponentProps,
  State,
> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SECTION_LIST;

  static localNameAliases = [];

  parser: DOMParser = new DOMParser();

  props: HvComponentProps;

  state: State = {
    refreshing: false,
  };

  refresh = () => {
    this.setState({ refreshing: true });
    const path = this.props.element.getAttribute('href');
    const action = this.props.element.getAttribute('action') || 'append';
    const targetId = this.props.element.getAttribute('target') || null;
    const showIndicatorIds =
      this.props.element.getAttribute('show-during-load') || null;
    const hideIndicatorIds =
      this.props.element.getAttribute('hide-during-load') || null;
    const delay = this.props.element.getAttribute('delay');
    const once = this.props.element.getAttribute('once') || null;

    this.props.onUpdate(path, action, this.props.element, {
      delay,
      hideIndicatorIds,
      once,
      onEnd: () => {
        this.setState({ refreshing: false });
      },
      showIndicatorIds,
      targetId,
    });
  };

  render() {
    const styleAttr = this.props.element.getAttribute('style');
    const style = styleAttr
      ? styleAttr.split(' ').map(s => this.props.stylesheets.regular[s])
      : null;

    const sectionElements = this.props.element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'section',
    );
    const sections = [];

    for (let i = 0; i < sectionElements.length; i += 1) {
      const sectionElement = sectionElements.item(i);
      if (sectionElement) {
        const itemElements = sectionElement.getElementsByTagNameNS(
          Namespaces.HYPERVIEW,
          'item',
        );
        const items = [];
        for (let j = 0; j < itemElements.length; j += 1) {
          const itemElement = itemElements.item(j);
          items.push(itemElement);
        }
        const titleElement = sectionElement
          .getElementsByTagNameNS(Namespaces.HYPERVIEW, 'section-title')
          .item(0);
        sections.push({
          data: items,
          title: titleElement,
        });
      }
    }

    const listProps = {
      keyExtractor: item => item.getAttribute('key'),
      renderItem: ({ item }) =>
        Render.renderElement(
          item,
          this.props.stylesheets,
          this.props.onUpdate,
          this.props.options,
        ),
      renderSectionHeader: ({ section: { title } }) =>
        Render.renderElement(
          title,
          this.props.stylesheets,
          this.props.onUpdate,
          this.props.options,
        ),
      sections: sections.filter(s => s.data.length > 0),
      style,
    };

    let refreshProps = {};
    if (this.props.element.getAttribute('trigger') === 'refresh') {
      refreshProps = {
        onRefresh: () => this.refresh(),
        refreshing: this.state.refreshing,
      };
    }

    const props: any = {
      ...listProps,
      ...refreshProps,
    };

    return React.createElement(SectionList, props);
  }
}
