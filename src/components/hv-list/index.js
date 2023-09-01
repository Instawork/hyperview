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
import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  DOMString,
  Document,
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  HvComponentProps,
} from 'hyperview/src/types';
import {
  RefreshControl as DefaultRefreshControl,
  FlatList,
  Platform,
} from 'react-native';
import React, { PureComponent } from 'react';
import type { ScrollParams, State } from './types';
import { DOMParser } from '@instawork/xmldom';
import type { ElementRef } from 'react';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getAncestorByTagName } from 'hyperview/src/services';

export default class HvList extends PureComponent<HvComponentProps, State> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.LIST;

  static localNameAliases = [];

  static contextType = Contexts.DocContext;

  parser: DOMParser = new DOMParser();

  props: HvComponentProps;

  ref: ?ElementRef<typeof FlatList>;

  state: State = {
    refreshing: false,
  };

  onRef = (ref: ?ElementRef<typeof FlatList>) => {
    this.ref = ref;
  };

  onUpdate: HvComponentOnUpdate = (
    href: ?DOMString,
    action: ?DOMString,
    element: Element,
    options: HvComponentOptions,
  ) => {
    if (action === 'scroll' && options.behaviorElement) {
      this.handleScrollBehavior(options.behaviorElement);
      return;
    }
    this.props.onUpdate(href, action, element, options);
  };

  handleScrollBehavior = (behaviorElement: Element) => {
    const targetId: ?DOMString = behaviorElement?.getAttribute('target');
    if (!targetId) {
      console.warn('[behaviors/scroll]: missing "target" attribute');
      return;
    }
    const doc: ?Document = this.context();
    const targetElement: ?Element = doc?.getElementById(targetId);
    if (!targetElement) {
      return;
    }

    const targetElementParentList = getAncestorByTagName(
      targetElement,
      LOCAL_NAME.LIST,
    );
    if (targetElementParentList !== this.props.element) {
      return;
    }
    const listItems = Array.from(
      this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.ITEM,
      ),
    );

    // Target can either be an <item> or a child of an <item>
    const targetListItem =
      targetElement.localName === LOCAL_NAME.ITEM
        ? targetElement
        : getAncestorByTagName(targetElement, LOCAL_NAME.ITEM);

    if (!targetListItem) {
      return;
    }

    // find index of target in list
    const index = listItems.indexOf(targetListItem);
    if (index < 0) {
      return;
    }

    const animated: boolean =
      behaviorElement?.getAttributeNS(
        Namespaces.HYPERVIEW_SCROLL,
        'animated',
      ) === 'true';
    const params: ScrollParams = { animated, index };

    const viewOffset: ?number =
      parseInt(
        behaviorElement?.getAttributeNS(Namespaces.HYPERVIEW_SCROLL, 'offset'),
        10,
      ) || undefined;
    if (typeof viewOffset === 'number') {
      params.viewOffset = viewOffset;
    }

    const viewPosition: ?number =
      parseFloat(
        behaviorElement?.getAttributeNS(
          Namespaces.HYPERVIEW_SCROLL,
          'position',
        ),
      ) || undefined;

    if (typeof viewPosition === 'number') {
      params.viewPosition = viewPosition;
    }

    this.ref?.scrollToIndex(params);
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

  getItems = () => {
    const isOwnedBySelf = item => {
      if (item.parentNode === this.props.element) {
        return true;
      }
      if (
        item.parentNode.tagName === LOCAL_NAME.ITEMS &&
        item.parentNode.namespaceURI === Namespaces.HYPERVIEW &&
        item.parentNode.parentNode === this.props.element
      ) {
        return true;
      }
      if (
        item.parentNode.tagName === LOCAL_NAME.LIST &&
        item.parentNode.namespaceURI === Namespaces.HYPERVIEW &&
        item.parentNode.parentNode !== this.props.element
      ) {
        return false;
      }
      return isOwnedBySelf(item.parentNode);
    };

    return Array.from(
      this.props.element
        // $FlowFixMe: this.props.element is an Element, not a Node
        .getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.ITEM),
    ).filter(isOwnedBySelf);
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

    // Fix scrollbar rendering issue in iOS 13+
    // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
    const scrollIndicatorInsets =
      Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13
        ? { right: 1 }
        : undefined;

    // add sticky indices
    const stickyHeaderIndices = Array.from(
      this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.ITEM,
      ),
    ).reduce((acc, element, index) => {
      return typeof element !== 'string' &&
        element &&
        element.getAttribute &&
        element.getAttribute('sticky') === 'true'
        ? [...acc, index]
        : acc;
    }, []);

    return (
      <Contexts.RefreshControlComponentContext.Consumer>
        {ContextRefreshControl => {
          const RefreshControl = ContextRefreshControl || DefaultRefreshControl;
          return (
            <FlatList
              ref={this.onRef}
              data={this.getItems()}
              horizontal={horizontal}
              keyExtractor={item => item && item.getAttribute('key')}
              refreshControl={
                <RefreshControl
                  onRefresh={this.refresh}
                  refreshing={this.state.refreshing}
                />
              }
              removeClippedSubviews={false}
              renderItem={({ item }) =>
                item &&
                Render.renderElement(
                  item,
                  this.props.stylesheets,
                  this.onUpdate,
                  this.props.options,
                )
              }
              scrollIndicatorInsets={scrollIndicatorInsets}
              showsHorizontalScrollIndicator={horizontal && showScrollIndicator}
              showsVerticalScrollIndicator={!horizontal && showScrollIndicator}
              stickyHeaderIndices={stickyHeaderIndices}
              style={style}
            />
          );
        }}
      </Contexts.RefreshControlComponentContext.Consumer>
    );
  }
}
