// @flow

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type { Props, State } from './types';
import React, { PureComponent } from 'react';
import { DOMParser } from 'xmldom';
import { LOCAL_NAME } from 'hyperview/src/types';
import { SectionList } from 'react-native';

export default class HvSectionList extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.SECTION_LIST;
  parser: DOMParser = new DOMParser();
  props: Props;
  state: State = {
    refreshing: false,
  }

  refresh = () => {
    const { element, onUpdate } = this.props;
    this.setState({ refreshing: true });
    const path = element.getAttribute('href');
    const action = element.getAttribute('action') || 'append';
    const targetId = element.getAttribute('target') || null;
    const showIndicatorIds = element.getAttribute('show-during-load') || null;
    const hideIndicatorIds = element.getAttribute('hide-during-load') || null;
    const delay = element.getAttribute('delay');
    const once = element.getAttribute('once') || null;

    onUpdate(path, action, element, {
      targetId,
      showIndicatorIds,
      hideIndicatorIds,
      delay,
      once,
      onEnd: () => {
        this.setState({ refreshing: false });
      },
    });
  }

  render() {
    const { refreshing } = this.state;
    const { element, stylesheets, animations, onUpdate, options } = this.props;
    const styleAttr = element.getAttribute('style');
    const style = styleAttr ? styleAttr.split(' ').map(s => stylesheets.regular[s]) : null;

    const sectionElements = element.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'section');
    const sections = [];

    for (let i = 0; i < sectionElements.length; i += 1) {
      const sectionElement = sectionElements.item(i);
      const itemElements = sectionElement.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'item');
      const items = [];
      for (let j = 0; j < itemElements.length; j += 1) {
        const itemElement = itemElements.item(j);
        items.push(itemElement);
      }
      const titleElement = sectionElement.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'section-title').item(0);
      sections.push({
        title: titleElement,
        data: items,
      });
    }

    const listProps = {
      style,
      sections,
      keyExtractor: item => item.getAttribute('key'),
      // $FlowFixMe: return value should be of ?React.Element<any>
      renderItem: ({ item }) => (
        Render.renderElement(item, stylesheets, animations, onUpdate, options)
      ),
      // $FlowFixMe: return value should be of ?React.Element<any>
      renderSectionHeader: ({ section: { title } }) => (
        Render.renderElement(title, stylesheets, animations, onUpdate, options)
      ),
    };

    let refreshProps = {};
    if (element.getAttribute('trigger') === 'refresh') {
      refreshProps = {
        onRefresh: () => this.refresh(),
        refreshing,
      };
    }

    return React.createElement(
      SectionList,
      {
        ...listProps,
        ...refreshProps,
      },
    );
  }
}
