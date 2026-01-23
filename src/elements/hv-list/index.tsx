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
import React, { useCallback, useRef, useState } from 'react';
import {
  createStyleProp,
  createTestProps,
  getAncestorByTagName,
} from 'hyperview/src/services';
import { BehaviorScrollError } from 'hyperview/src/errors';
import type { ElementRef } from 'react';
// eslint-disable-next-line instawork/import-components
import { FlatList } from 'hyperview/src/components/scroll';
import HvElement from 'hyperview/src/components/hv-element';
import { HyperviewConsumer } from 'hyperview/src/contexts/hyperview';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { ScrollParams } from './types';
import { useHvDocContext } from 'hyperview/src/elements/hv-doc';

const HvList = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const ref = useRef<ElementRef<typeof FlatList> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { getDoc } = useHvDocContext();

  const handleScrollBehavior = useCallback(
    (behaviorElement: Element) => {
      const targetId:
        | DOMString
        | null
        | undefined = behaviorElement?.getAttribute('target');
      if (!targetId) {
        Logging.warn(new BehaviorScrollError(behaviorElement));
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
        LOCAL_NAME.LIST,
      );
      if (targetElementParentList !== element) {
        return;
      }
      const listItems = Array.from(
        element.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.ITEM),
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

      const viewOffset: number | null | undefined =
        parseInt(
          behaviorElement?.getAttributeNS(
            Namespaces.HYPERVIEW_SCROLL,
            'offset',
          ) || '',
          10,
        ) || undefined;
      if (typeof viewOffset === 'number') {
        params.viewOffset = viewOffset;
      }

      const viewPosition: number | null | undefined =
        parseFloat(
          behaviorElement?.getAttributeNS(
            Namespaces.HYPERVIEW_SCROLL,
            'position',
          ) || '',
        ) || undefined;
      if (typeof viewPosition === 'number') {
        params.viewPosition = viewPosition;
      }

      ref.current?.scrollToIndex(params);
    },
    [element, getDoc],
  );

  const onListUpdate: HvComponentOnUpdate = useCallback(
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

  const refresh = useCallback(() => {
    setRefreshing(true);

    Dom.getBehaviorElements(element)
      .filter(e => e.getAttribute('trigger') === 'refresh')
      .forEach((e, i) => {
        const path = e.getAttribute('href');
        const action = e.getAttribute('action') || 'append';
        const targetId = e.getAttribute('target');
        const showIndicatorIds = e.getAttribute('show-during-load');
        const hideIndicatorIds = e.getAttribute('hide-during-load');
        const delay = e.getAttribute('delay');
        const once = e.getAttribute('once');
        const onEnd = i === 0 ? () => setRefreshing(false) : null;
        onUpdate(path, action, element, {
          behaviorElement: e,
          delay,
          hideIndicatorIds,
          once,
          onEnd,
          showIndicatorIds,
          targetId,
        });
      });
  }, [element, onUpdate]);

  const getItems = useCallback(() => {
    const isOwnedBySelf = (item: Element): boolean => {
      if (item.parentNode === element) {
        return true;
      }
      if (item.parentNode === null || typeof item.parentNode === 'undefined') {
        return false;
      }
      if (
        (item.parentNode as Element).tagName === LOCAL_NAME.ITEMS &&
        (item.parentNode as Element).namespaceURI === Namespaces.HYPERVIEW &&
        item.parentNode.parentNode === element
      ) {
        return true;
      }
      if (
        (item.parentNode as Element).tagName === LOCAL_NAME.LIST &&
        (item.parentNode as Element).namespaceURI === Namespaces.HYPERVIEW &&
        item.parentNode.parentNode !== element
      ) {
        return false;
      }
      return isOwnedBySelf(item.parentNode as Element);
    };

    return Array.from(
      element.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.ITEM),
    ).filter(isOwnedBySelf);
  }, [element]);

  const styleAttr = element.getAttribute('style');
  const style = styleAttr
    ? styleAttr.split(' ').map(s => stylesheets.regular[s])
    : null;

  const horizontal =
    element.getAttribute('scroll-orientation') === 'horizontal';
  const showScrollIndicator =
    element.getAttribute('shows-scroll-indicator') !== 'false';

  // Fix scrollbar rendering issue in iOS 13+
  // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
  const scrollIndicatorInsets =
    Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13
      ? { right: 1 }
      : undefined;

  // add sticky indices
  const stickyHeaderIndices = Array.from(
    element.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.ITEM),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).reduce<Array<any>>((acc, el, index) => {
    return typeof el !== 'string' &&
      el &&
      el.getAttribute &&
      el.getAttribute('sticky') === 'true'
      ? [...acc, index]
      : acc;
  }, []);

  const { testID, accessibilityLabel } = createTestProps(element);

  const contentContainerStyle = element.getAttribute('content-container-style')
    ? createStyleProp(element, stylesheets, {
        ...options,
        styleAttr: 'content-container-style',
      })
    : undefined;

  // Allow disabling scroll bouncing (on by default)
  const bounces =
    element.getAttribute('over-scroll') === 'false' && Platform.OS === 'ios'
      ? false
      : undefined;
  const overScrollMode =
    element.getAttribute('over-scroll') === 'false' && Platform.OS === 'android'
      ? 'never'
      : undefined;

  return (
    <HyperviewConsumer>
      {({ refreshControl }) => {
        const RefreshControl = refreshControl ?? DefaultRefreshControl;
        const hasRefreshTrigger = element.getAttribute('trigger') === 'refresh';
        return (
          <FlatList
            ref={ref}
            accessibilityLabel={accessibilityLabel}
            bounces={bounces}
            contentContainerStyle={contentContainerStyle}
            data={getItems()}
            element={element}
            horizontal={horizontal}
            keyboardDismissMode={Keyboard.getKeyboardDismissMode(element)}
            keyboardShouldPersistTaps={Keyboard.getKeyboardShouldPersistTaps(
              element,
            )}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            keyExtractor={(item: any) => item && item.getAttribute('key')}
            overScrollMode={overScrollMode}
            refreshControl={
              hasRefreshTrigger ? (
                <RefreshControl onRefresh={refresh} refreshing={refreshing} />
              ) : undefined
            }
            removeClippedSubviews={false}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderItem={({ item }: any) =>
              item && (
                <HvElement
                  element={item as Element}
                  onUpdate={onListUpdate}
                  options={options}
                  stylesheets={stylesheets}
                />
              )
            }
            scrollIndicatorInsets={scrollIndicatorInsets}
            showsHorizontalScrollIndicator={horizontal && showScrollIndicator}
            showsVerticalScrollIndicator={!horizontal && showScrollIndicator}
            stickyHeaderIndices={stickyHeaderIndices}
            style={style}
            testID={testID}
          />
        );
      }}
    </HyperviewConsumer>
  );
};

HvList.namespaceURI = Namespaces.HYPERVIEW;
HvList.localName = LOCAL_NAME.LIST;

export default HvList;
