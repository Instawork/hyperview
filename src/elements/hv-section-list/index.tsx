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
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import type { ScrollParams, State } from './types';
import { createTestProps, getAncestorByTagName } from 'hyperview/src/services';
import { DOMParser } from '@instawork/xmldom';
import type { ElementRef } from 'react';
import HvElement from 'hyperview/src/core/components/hv-element';
import { HyperviewContext } from 'hyperview/src/contexts/hyperview';
import { SectionList } from 'hyperview/src/core/components/scroll';

const getSectionIndex = (
  sectionTitle: Element,
  sectionTitles: HTMLCollectionOf<Element>,
): number => {
  const sectionIndex = Array.from(sectionTitles).indexOf(sectionTitle);

  // If first section did not have an explicit title, we still need to account for it
  const previousElement = Dom.getPreviousNodeOfType(
    sectionTitles[0],
    NODE_TYPE.ELEMENT_NODE,
  );
  if ((previousElement as Element)?.localName === LOCAL_NAME.ITEM) {
    return sectionIndex + 1;
  }

  return sectionIndex;
};

const getPreviousSectionTitle = (
  element: Element,
  itemIndex: number,
): [Element | null, number] => {
  const { previousSibling } = element;
  if (!previousSibling) {
    return [null, itemIndex];
  }
  if ((previousSibling as Element).localName === LOCAL_NAME.SECTION_TITLE) {
    return [previousSibling as Element, itemIndex];
  }
  if ((previousSibling as Element).localName === LOCAL_NAME.ITEM) {
    // eslint-disable-next-line no-param-reassign
    itemIndex += 1;
  }
  return getPreviousSectionTitle(previousSibling as Element, itemIndex);
};

export default class HvSectionList extends PureComponent<
  HvComponentProps,
  State
> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SECTION_LIST;

  context: React.ContextType<typeof Contexts.DocContext> = null;

  static contextType = Contexts.DocContext;

  parser: DOMParser = new DOMParser();

  ref: ElementRef<typeof SectionList> | null = null;

  state: State = {
    refreshing: false,
  };

  onRef = (ref: ElementRef<typeof SectionList> | null) => {
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
    const doc: Document | undefined = this.context?.getDoc();
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

    // find index of target in section-list
    // first, check legacy section-list format, where items are nested under a <section>
    const targetElementParentSection = getAncestorByTagName(
      targetElement,
      LOCAL_NAME.SECTION,
    );
    if (targetElementParentSection) {
      const sections = this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.SECTION,
      );
      const sectionIndex = Array.from(sections).indexOf(
        targetElementParentSection,
      );
      if (sectionIndex === -1) {
        return;
      }
      const itemsInSection = Array.from(
        targetElementParentSection.getElementsByTagNameNS(
          Namespaces.HYPERVIEW,
          LOCAL_NAME.ITEM,
        ),
      );
      const itemIndex = itemsInSection.indexOf(targetListItem);
      if (itemIndex === -1) {
        return;
      }

      const params: ScrollParams = {
        animated,
        itemIndex: itemIndex + 1,
        sectionIndex,
      };
      if (typeof viewOffset === 'number') {
        params.viewOffset = viewOffset;
      }

      if (typeof viewPosition === 'number') {
        params.viewPosition = viewPosition;
      }

      this.ref?.scrollToLocation(params);
    } else {
      // eslint-disable-next-line max-len
      // No parent section? Check new section-list format, where items are nested under the section-list
      const items = this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.ITEM,
      );
      if (Array.from(items).indexOf(targetListItem) === -1) {
        return;
      }
      const [sectionTitle, itemIndex] = getPreviousSectionTitle(
        targetListItem,
        1, // 1 instead of 0 as it appears itemIndex is 1-based
      );
      const sectionTitles = this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.SECTION_TITLE,
      );
      const sectionIndex = sectionTitle
        ? getSectionIndex(sectionTitle, sectionTitles)
        : 0;
      if (sectionIndex === -1) {
        return;
      }
      const params: ScrollParams = {
        animated,
        itemIndex,
        sectionIndex,
      };
      if (viewOffset) {
        params.viewOffset = viewOffset;
      }
      if (viewPosition) {
        params.viewPosition = viewPosition;
      }
      this.ref?.scrollToLocation(params);
    }
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

  render() {
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

    let items = [];
    let titleElement = null;
    const sections: { data: Element[]; title: Element | null }[] = [];

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

    const { testID, accessibilityLabel } = createTestProps(this.props.element);

    return (
      <HyperviewContext.Consumer>
        {hyperview => {
          const RefreshControl =
            hyperview?.refreshControl || DefaultRefreshControl;
          const hasRefreshTrigger =
            this.props.element.getAttribute('trigger') === 'refresh';
          return (
            <SectionList
              ref={this.onRef}
              accessibilityLabel={accessibilityLabel}
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderItem={({ item }: any): any => (
                <HvElement
                  element={item as Element}
                  onUpdate={this.onUpdate}
                  options={this.props.options}
                  stylesheets={this.props.stylesheets}
                />
              )}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderSectionHeader={({ section: { title } }: any): any => (
                <HvElement
                  element={title as Element}
                  onUpdate={this.onUpdate}
                  options={this.props.options}
                  stylesheets={this.props.stylesheets}
                />
              )}
              scrollIndicatorInsets={scrollIndicatorInsets}
              sections={sections}
              stickySectionHeadersEnabled={this.getStickySectionHeadersEnabled()}
              style={style}
              testID={testID}
            />
          );
        }}
      </HyperviewContext.Consumer>
    );
  }
}
