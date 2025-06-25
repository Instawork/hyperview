import * as Contexts from 'hyperview/src/contexts';
import * as Dom from 'hyperview/src/services/dom';
import * as Keyboard from 'hyperview/src/services/keyboard';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  HvComponentOptions,
  HvComponentProps,
} from 'hyperview/src/types';
import {
  RefreshControl as DefaultRefreshControl,
  Platform,
} from 'react-native';
import { LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createTestProps, getAncestorByTagName } from 'hyperview/src/services';
import type { ElementRef } from 'react';
import HvElement from 'hyperview/src/core/components/hv-element';
import { HyperviewContext } from 'hyperview/src/contexts/hyperview';
import type { ScrollParams } from './types';
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

const HvSectionList = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const ref = useRef<ElementRef<typeof SectionList> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { getDoc } = useContext(Contexts.DocContext) || {};

  const handleScrollBehavior = useCallback(
    (behaviorElement: Element) => {
      const targetId:
        | DOMString
        | null
        | undefined = behaviorElement?.getAttribute('target');
      if (!targetId) {
        Logging.warn('[behaviors/scroll]: missing "target" attribute');
        return;
      }
      const doc: Document | undefined = getDoc?.();
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
      if (targetElementParentList !== element) {
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
        const sections = element.getElementsByTagNameNS(
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

        ref.current?.scrollToLocation(params);
      } else {
        // eslint-disable-next-line max-len
        // No parent section? Check new section-list format, where items are nested under the section-list
        const items = element.getElementsByTagNameNS(
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
        const sectionTitles = element.getElementsByTagNameNS(
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
        ref.current?.scrollToLocation(params);
      }
    },
    [element, getDoc],
  );

  const onListUpdate = useCallback(
    (
      href: DOMString | null | undefined,
      action: DOMString | null | undefined,
      el: Element,
      opts: HvComponentOptions,
    ) => {
      if (action === 'scroll' && opts.behaviorElement) {
        handleScrollBehavior(opts.behaviorElement);
        return;
      }
      onUpdate(href, action, el, opts);
    },
    [handleScrollBehavior, onUpdate],
  );

  const getStickySectionHeadersEnabled = useCallback((): boolean => {
    const stickySectionTitles = element.getAttribute('sticky-section-titles');
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
  }, [element]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    const path = element.getAttribute('href');
    const action = element.getAttribute('action') || 'append';
    const targetId = element.getAttribute('target') || null;
    const showIndicatorIds = element.getAttribute('show-during-load') || null;
    const hideIndicatorIds = element.getAttribute('hide-during-load') || null;
    const delay = element.getAttribute('delay');
    const once = element.getAttribute('once') || null;

    onUpdate(path, action, element, {
      behaviorElement: element,
      delay,
      hideIndicatorIds,
      once,
      onEnd: () => {
        setRefreshing(false);
      },
      showIndicatorIds,
      targetId,
    });
  }, [element, onUpdate, setRefreshing]);

  const styleAttr = element.getAttribute('style');
  const style = styleAttr
    ? styleAttr.split(' ').map(s => stylesheets.regular[s])
    : null;

  const flattened: Element[] = useMemo(() => [], []);

  const addNodes = useCallback(
    (sectionElement: Element) => {
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
    },
    [flattened],
  );

  addNodes(element);

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

  const { testID, accessibilityLabel } = createTestProps(element);

  return (
    <HyperviewContext.Consumer>
      {hyperview => {
        const RefreshControl =
          hyperview?.refreshControl || DefaultRefreshControl;
        const hasRefreshTrigger = element.getAttribute('trigger') === 'refresh';
        return (
          <SectionList
            ref={ref}
            accessibilityLabel={accessibilityLabel}
            element={element}
            keyboardDismissMode={Keyboard.getKeyboardDismissMode(element)}
            keyboardShouldPersistTaps={Keyboard.getKeyboardShouldPersistTaps(
              element,
            )}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            keyExtractor={(item: any) => item.getAttribute('key')}
            refreshControl={
              hasRefreshTrigger ? (
                <RefreshControl onRefresh={refresh} refreshing={refreshing} />
              ) : undefined
            }
            removeClippedSubviews={false}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderItem={({ item }: any): any => (
              <HvElement
                element={item as Element}
                onUpdate={onListUpdate}
                options={options}
                stylesheets={stylesheets}
              />
            )}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderSectionHeader={({ section: { title } }: any): any => (
              <HvElement
                element={title as Element}
                onUpdate={onListUpdate}
                options={options}
                stylesheets={stylesheets}
              />
            )}
            scrollIndicatorInsets={scrollIndicatorInsets}
            sections={sections}
            stickySectionHeadersEnabled={getStickySectionHeadersEnabled()}
            style={style}
            testID={testID}
          />
        );
      }}
    </HyperviewContext.Consumer>
  );
};

HvSectionList.namespaceURI = Namespaces.HYPERVIEW;
HvSectionList.localName = LOCAL_NAME.SECTION_LIST;

export default HvSectionList;
