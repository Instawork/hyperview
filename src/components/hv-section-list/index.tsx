import * as Contexts from 'hyperview/src/contexts';
import * as Dom from 'hyperview/src/services/dom';
import * as Keyboard from 'hyperview/src/services/keyboard';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  HvComponentOnUpdate,
  HvComponentOptions,
  HvComponentProps,
} from 'hyperview/src/types';
import {
  RefreshControl as DefaultRefreshControl,
  Platform,
} from 'react-native';
import React, { PureComponent } from 'react';
import type { ScrollParams, State } from './types';
import { createTestProps, getAncestorByTagName } from 'hyperview/src/services';
import { DOMParser } from '@instawork/xmldom';
import type { ElementRef } from 'react';
import { FlatList } from 'hyperview/src/core/components/scroll';
import HvElement from 'hyperview/src/core/components/hv-element';
import { LOCAL_NAME } from 'hyperview/src/types';

export default class HvSectionList extends PureComponent<
  HvComponentProps,
  State
> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SECTION_LIST;

  context: React.ContextType<typeof Contexts.DocContext> = null;

  static contextType = Contexts.DocContext;

  parser: DOMParser = new DOMParser();

  startTime: number = Date.now();

  renderCount: number = 0;

  ref: ElementRef<typeof FlatList> | null = null;

  state: State = {
    refreshing: false,
  };

  onRef = (ref: ElementRef<typeof FlatList> | null) => {
    this.ref = ref;
  };

  onUpdate: HvComponentOnUpdate = (
    href: DOMString | null | undefined,
    action: DOMString | null | undefined,
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
    const targetId:
      | DOMString
      | null
      | undefined = behaviorElement?.getAttribute('target');
    if (!targetId) {
      Logging.warn('[behaviors/scroll]: missing "target" attribute');
      return;
    }
    const doc: Document | null | undefined = this.context?.getDoc();
    const targetElement: Element | null | undefined = Dom.getElementById(
      doc,
      targetId,
    );
    if (!targetElement) {
      return;
    }

    const targetElementParentList = getAncestorByTagName(
      targetElement,
      LOCAL_NAME.SECTION_LIST,
    );
    if (targetElementParentList !== this.props.element) {
      return;
    }

    // Target can either be an <item> or a child of an <item>
    const targetListItem =
      targetElement.localName === LOCAL_NAME.ITEM
        ? targetElement
        : getAncestorByTagName(targetElement, LOCAL_NAME.ITEM);

    const animated: boolean =
      behaviorElement?.getAttributeNS(
        Namespaces.HYPERVIEW_SCROLL,
        'animated',
      ) === 'true';

    const viewOffset: number | null | undefined =
      parseInt(
        behaviorElement?.getAttributeNS(
          Namespaces.HYPERVIEW_SCROLL,
          'offset',
        ) || '',
        10,
      ) || undefined;

    const viewPosition: number | null | undefined =
      parseFloat(
        behaviorElement?.getAttributeNS(
          Namespaces.HYPERVIEW_SCROLL,
          'position',
        ) || '',
      ) || undefined;

    if (!targetListItem) {
      return;
    }

    // eslint-disable-next-line max-len
    // No parent section? Check new section-list format, where items are nested under the section-list
    const items = this.props.element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      LOCAL_NAME.ITEM,
    );
    const itemIndex = Array.from(items).indexOf(targetListItem);
    if (itemIndex === -1) {
      return;
    }

    const params: ScrollParams = {
      animated,
      index: itemIndex,
    };
    if (viewOffset) {
      params.viewOffset = viewOffset;
    }
    if (viewPosition) {
      params.viewPosition = viewPosition;
    }

    this.ref?.scrollToIndex(params);
  };

  getStickySectionHeadersEnabled = (): boolean => {
    const stickySectionTitles = this.props.element.getAttribute(
      'sticky-section-titles',
    );
    if (stickySectionTitles === 'true') {
      return true;
    }
    if (stickySectionTitles === 'false') {
      return false;
    }
    // Set platform default behavior
    // https://reactnative.dev/docs/sectionlist#stickysectionheadersenabled
    return (
      Platform.select({
        android: false,
        ios: true,
      }) || false
    );
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
      behaviorElement: this.props.element,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderListItem = (item: any) => {
    return (
      <HvElement
        element={item.item as Element}
        onUpdate={this.onUpdate}
        options={this.props.options}
        stylesheets={this.props.stylesheets}
      />
    );
  };

  render() {
    this.renderCount += 1;
    const styleAttr = this.props.element.getAttribute('style');
    const style = styleAttr
      ? styleAttr.split(' ').map(s => this.props.stylesheets.regular[s])
      : null;

    const flattened: Element[] = [];

    const addNodes = (sectionElement: Element) => {
      if (sectionElement.childNodes) {
        for (let j = 0; j < sectionElement.childNodes.length; j += 1) {
          const node = sectionElement.childNodes[j];
          if (
            node.nodeName === LOCAL_NAME.ITEMS ||
            node.nodeName === LOCAL_NAME.SECTION
          ) {
            addNodes(node as Element);
          } else if (
            node.nodeName === LOCAL_NAME.ITEM ||
            node.nodeName === LOCAL_NAME.SECTION_TITLE
          ) {
            flattened.push(sectionElement.childNodes[j] as Element);
          }
        }
      }
    };

    addNodes(this.props.element);

    const data: Element[] = [];
    const headerIndeces: number[] = [];

    for (let j = 0; j < flattened.length; j += 1) {
      const sectionElement = flattened[j];
      if (sectionElement) {
        if (sectionElement.nodeName === LOCAL_NAME.ITEM) {
          data.push(sectionElement);
        } else if (sectionElement.nodeName === LOCAL_NAME.SECTION_TITLE) {
          headerIndeces.push(j);
          data.push(sectionElement);
        }
      }
    }

    // Fix scrollbar rendering issue in iOS 13+
    // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
    const scrollIndicatorInsets =
      Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13
        ? { right: 1 }
        : undefined;

    const { testID, accessibilityLabel } = createTestProps(this.props.element);

    console.log(
      '>> SectionList render time:',
      Date.now() - this.startTime,
      'render count:',
      this.renderCount,
    );

    return (
      <Contexts.RefreshControlComponentContext.Consumer>
        {ContextRefreshControl => {
          const RefreshControl = ContextRefreshControl || DefaultRefreshControl;
          const hasRefreshTrigger =
            this.props.element.getAttribute('trigger') === 'refresh';
          return (
            <FlatList
              ref={this.onRef}
              accessibilityLabel={accessibilityLabel}
              data={data}
              element={this.props.element}
              keyboardDismissMode={Keyboard.getKeyboardDismissMode(
                this.props.element,
              )}
              keyboardShouldPersistTaps={Keyboard.getKeyboardShouldPersistTaps(
                this.props.element,
              )}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              keyExtractor={(item: any) => item.getAttribute('key')}
              refreshControl={
                hasRefreshTrigger ? (
                  <RefreshControl
                    onRefresh={this.refresh}
                    refreshing={this.state.refreshing}
                  />
                ) : undefined
              }
              removeClippedSubviews={false}
              renderItem={this.renderListItem}
              scrollIndicatorInsets={scrollIndicatorInsets}
              stickyHeaderIndices={
                this.getStickySectionHeadersEnabled()
                  ? headerIndeces
                  : undefined
              }
              style={style}
              testID={testID}
            />
          );
        }}
      </Contexts.RefreshControlComponentContext.Consumer>
    );
  }
}
