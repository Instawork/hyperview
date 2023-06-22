// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// $FlowFixMe: importing code from TypeScript
import * as Contexts from 'hyperview/src/contexts';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import {
  RefreshControl as DefaultRefreshControl,
  Platform,
  SectionList,
} from 'react-native';

import React, { PureComponent } from 'react';

import { DOMParser } from 'xmldom-instawork';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { State } from './types';

export default class HvSectionList extends PureComponent<
  HvComponentProps,
  State,
> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SECTION_LIST;

  static localNameAliases = [];

  static contextType = Contexts.RefreshControlComponentContext;

  parser: DOMParser = new DOMParser();

  props: HvComponentProps;

  state: State = {
    refreshing: false,
  };

  getStickySectionHeadersEnabled = (): ?boolean => {
    const stickySectionTitles = this.props.element.getAttribute(
      'sticky-section-titles',
    );
    if (stickySectionTitles === 'true') {
      return true;
    }
    if (stickySectionTitles === 'false') {
      return false;
    }
    return undefined;
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

    const flattened = [];

    const addNodes = sectionElement => {
      if (sectionElement.childNodes) {
        for (let j = 0; j < sectionElement.childNodes.length; j += 1) {
          const node = sectionElement.childNodes[j];
          if (
            node.nodeName === LOCAL_NAME.ITEMS ||
            node.nodeName === LOCAL_NAME.SECTION
          ) {
            addNodes(node);
          } else if (
            node.nodeName === LOCAL_NAME.ITEM ||
            node.nodeName === LOCAL_NAME.SECTION_TITLE
          ) {
            flattened.push(sectionElement.childNodes[j]);
          }
        }
      }
    };

    addNodes(this.props.element);

    let items = [];
    let titleElement = null;
    const sections = [];

    for (let j = 0; j < flattened.length; j += 1) {
      const sectionElement = flattened[j];
      if (sectionElement) {
        if (sectionElement.nodeName === LOCAL_NAME.ITEM) {
          items.push(sectionElement);
        } else if (sectionElement.nodeName === LOCAL_NAME.SECTION_TITLE) {
          if (items.length > 0) {
            sections.push({
              data: items,
              title: titleElement,
            });
            items = [];
          }
          titleElement = sectionElement;
        }
      }
    }

    if (items.length > 0) {
      sections.push({
        data: items,
        title: titleElement,
      });
    }

    // Fix scrollbar rendering issue in iOS 13+
    // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
    const scrollIndicatorInsets =
      Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13
        ? { right: 1 }
        : undefined;

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
      scrollIndicatorInsets,
      sections,
      stickySectionHeadersEnabled: this.getStickySectionHeadersEnabled(),
      style,
    };

    let refreshProps = {};
    if (this.props.element.getAttribute('trigger') === 'refresh') {
      const RefreshControl = this.context || DefaultRefreshControl;
      refreshProps = {
        refreshControl: (
          <RefreshControl
            onRefresh={this.refresh}
            refreshing={this.state.refreshing}
          />
        ),
      };
    }

    const props: any = {
      ...listProps,
      ...refreshProps,
    };

    return React.createElement(SectionList, props);
  }
}
