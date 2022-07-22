// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Render from 'hyperview/src/services/render';
import {
  ACTIONS,
  NAV_ACTIONS,
  PRESS_TRIGGERS,
  TRIGGERS,
  UPDATE_ACTIONS,
} from 'hyperview/src/types';
import { ATTRIBUTES, PRESS_TRIGGERS_PROP_NAMES } from './types';
import type {
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  PressTrigger,
  StyleSheet,
  StyleSheets,
  Trigger,
} from 'hyperview/src/types';
import type { PressHandlers, Props, State } from './types';
import React, { PureComponent } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import type { Node } from 'react';
import VisibilityDetectingView from 'hyperview/src/VisibilityDetectingView';
import { XMLSerializer } from 'xmldom-instawork';
import { createTestProps } from 'hyperview/src/services';

/**
 * Wrapper to handle UI events
 * Stop propagation and prevent default client behavior
 * This prevents clicks on various elements to trigger browser navigation
 * when using Hyperview for web.
 */
export const createEventHandler = (
  handler: () => void,
): ((event: any) => void) => event => {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  handler();
};

/**
 * Component that handles dispatching behaviors based on the appropriate
 * triggers.
 */
export default class HyperRef extends PureComponent<Props, State> {
  props: Props;

  state: State = {
    pressed: false,
    refreshing: false,
  };

  behaviorElements: Element[];

  style: ?StyleSheet;

  componentDidMount() {
    this.triggerLoadBehaviors();

    // Register event listener for on-event triggers
    Events.subscribe(this.onEventDispatch);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.element === this.props.element) {
      return;
    }
    // Retrieve and cache behavior elements when element is updated
    this.behaviorElements = Dom.getBehaviorElements(this.props.element);

    // Retrieve and cache style
    const styleAttr = this.props.element.getAttribute(ATTRIBUTES.HREF_STYLE);
    this.style = styleAttr
      ? styleAttr.split(' ').map(s => this.props.stylesheets.regular[s])
      : null;

    // Then trigger load behaviors
    this.triggerLoadBehaviors();
  }

  componentWillUnmount() {
    // Remove event listener for on-event triggers to avoid memory leaks
    Events.unsubscribe(this.onEventDispatch);
  }

  onEventDispatch = (eventName: string) => {
    const behaviorElements = Dom.getBehaviorElements(this.props.element);
    const onEventBehaviors = behaviorElements.filter(e => {
      if (e.getAttribute(ATTRIBUTES.TRIGGER) === TRIGGERS.ON_EVENT) {
        const currentAttributeEventName: ?string = e.getAttribute('event-name');
        const currentAttributeAction: ?string = e.getAttribute('action');
        if (currentAttributeAction === 'dispatch-event') {
          throw new Error(
            'trigger="on-event" and action="dispatch-event" cannot be used on the same element',
          );
        }
        if (!currentAttributeEventName) {
          throw new Error('on-event trigger requires an event-name attribute');
        }
        return currentAttributeEventName === eventName;
      }
      return false;
    });
    onEventBehaviors.forEach(behaviorElement => {
      const handler = this.createActionHandler(
        this.props.element,
        behaviorElement,
        this.props.onUpdate,
      );
      handler();
      if (__DEV__) {
        const listenerElement: Element = behaviorElement.cloneNode(false);
        const caughtEvent: string = behaviorElement.getAttribute('event-name');
        const serializer = new XMLSerializer();
        console.log(
          `[on-event] trigger [${caughtEvent}] caught by:`,
          serializer.serializeToString(listenerElement),
        );
      }
    });
  };

  createActionHandler = (
    element: Element,
    behaviorElement: Element,
    onUpdate: HvComponentOnUpdate,
  ) => {
    const action =
      behaviorElement.getAttribute(ATTRIBUTES.ACTION) || NAV_ACTIONS.PUSH;

    if (action === ACTIONS.RELOAD) {
      return () => {
        const href = behaviorElement.getAttribute(ATTRIBUTES.HREF);
        onUpdate(href, action, element, {});
      };
    }
    if (Object.values(NAV_ACTIONS).indexOf(action) >= 0) {
      return () => {
        const href = behaviorElement.getAttribute(ATTRIBUTES.HREF);
        const showIndicatorId = behaviorElement.getAttribute(
          ATTRIBUTES.SHOW_DURING_LOAD,
        );
        const delay = behaviorElement.getAttribute(ATTRIBUTES.DELAY);
        onUpdate(href, action, element, { delay, showIndicatorId });
      };
    }
    if (Object.values(UPDATE_ACTIONS).indexOf(action) >= 0) {
      return () => {
        const href = behaviorElement.getAttribute(ATTRIBUTES.HREF);
        const verb = behaviorElement.getAttribute(ATTRIBUTES.VERB);
        const targetId = behaviorElement.getAttribute(ATTRIBUTES.TARGET);
        const showIndicatorIds = behaviorElement.getAttribute(
          ATTRIBUTES.SHOW_DURING_LOAD,
        );
        const hideIndicatorIds = behaviorElement.getAttribute(
          ATTRIBUTES.HIDE_DURING_LOAD,
        );
        const delay = behaviorElement.getAttribute(ATTRIBUTES.DELAY);
        const once = behaviorElement.getAttribute(ATTRIBUTES.ONCE);
        onUpdate(href, action, element, {
          behaviorElement,
          delay,
          hideIndicatorIds,
          once,
          showIndicatorIds,
          targetId,
          verb,
        });
      };
    }
    // Custom behavior
    return () =>
      onUpdate(null, action, element, { behaviorElement, custom: true });
  };

  getBehaviorElements = (trigger: Trigger): Element[] => {
    return this.behaviorElements.filter(
      e => e.getAttribute(ATTRIBUTES.TRIGGER) === trigger,
    );
  };

  getStyle = (): ?StyleSheet => {
    const styleAttr = this.props.element.getAttribute(ATTRIBUTES.HREF_STYLE);
    return styleAttr
      ? styleAttr.split(' ').map(s => this.props.stylesheets.regular[s])
      : null;
  };

  triggerLoadBehaviors = () => {
    const loadBehaviors = this.getBehaviorElements(TRIGGERS.LOAD);
    loadBehaviors.forEach(behaviorElement => {
      const handler = this.createActionHandler(
        this.props.element,
        behaviorElement,
        this.props.onUpdate,
      );
      setTimeout(handler, 0);
    });
  };

  TouchableView = ({ children }: { children: Node }): Node => {
    const behaviors = this.behaviorElements.filter(
      e =>
        PRESS_TRIGGERS.indexOf(
          e.getAttribute(ATTRIBUTES.TRIGGER) || TRIGGERS.PRESS,
        ) >= 0,
    );
    if (!behaviors.length) {
      return children;
    }

    // $FlowFixMe: cannot spread Test props because return type is inexact
    const props = {
      // Component will use touchable opacity to trigger href.
      activeOpacity: 1,
      style: this.getStyle(),
      ...createTestProps(this.props.element),
    };

    // With multiple behaviors for the same trigger, we need to stagger
    // the updates a bit so that each update operates on the latest DOM.
    // Ideally, we could apply multiple DOM updates at a time.
    let time = 0;

    // $FlowFixMe
    const pressHandlers: PressHandlers = {};

    behaviors.forEach(behaviorElement => {
      const trigger: PressTrigger =
        // $FlowFixMe: casting DOMString to PressTrigger should probably be enforced by code
        behaviorElement.getAttribute(ATTRIBUTES.TRIGGER) || TRIGGERS.PRESS;
      const triggerPropName = PRESS_TRIGGERS_PROP_NAMES[trigger];
      const handler = this.createActionHandler(
        this.props.element,
        behaviorElement,
        this.props.onUpdate,
      );
      if (pressHandlers[triggerPropName]) {
        const oldHandler = pressHandlers[triggerPropName];
        pressHandlers[triggerPropName] = createEventHandler(() => {
          oldHandler();
          setTimeout(handler, time);
          time += 1;
        });
      } else {
        pressHandlers[triggerPropName] = createEventHandler(handler);
      }
    });

    if (pressHandlers.onPressIn) {
      const oldHandler = pressHandlers.onPressIn;
      pressHandlers.onPressIn = createEventHandler(() => {
        this.setState({ pressed: true });
        oldHandler();
      });
    } else {
      pressHandlers.onPressIn = createEventHandler(() => {
        this.setState({ pressed: true });
      });
    }

    if (pressHandlers.onPressOut) {
      const oldHandler = pressHandlers.onPressOut;
      pressHandlers.onPressOut = createEventHandler(() => {
        this.setState({ pressed: false });
        oldHandler();
      });
    } else {
      pressHandlers.onPressOut = createEventHandler(() => {
        this.setState({ pressed: false });
      });
    }

    // Fix a conflict between onPressOut and onPress triggering at the same time.
    if (pressHandlers.onPressOut && pressHandlers.onPress) {
      const onPressHandler = pressHandlers.onPress;
      pressHandlers.onPress = createEventHandler(() => {
        setTimeout(onPressHandler, time);
      });
    }

    return React.createElement(
      TouchableOpacity,
      { ...props, ...pressHandlers, accessible: false },
      children,
    );
  };

  ScrollableView = ({ children }: { children: Node }): Node => {
    const behaviors = this.getBehaviorElements(TRIGGERS.REFRESH);
    if (!behaviors.length) {
      return children;
    }
    const refreshHandlers = behaviors.map(behaviorElement =>
      this.createActionHandler(
        this.props.element,
        behaviorElement,
        this.props.onUpdate,
      ),
    );
    const onRefresh = () => refreshHandlers.forEach(h => h());

    const refreshControl = React.createElement(RefreshControl, {
      onRefresh,
      refreshing: this.state.refreshing,
    });
    return React.createElement(
      ScrollView,
      { refreshControl, style: this.getStyle() },
      children,
    );
  };

  VisibilityView = ({ children }: { children: Node }): Node => {
    const behaviors = this.getBehaviorElements(TRIGGERS.VISIBLE);
    if (!behaviors.length) {
      return children;
    }
    const visibleHandlers = behaviors.map(behaviorElement =>
      this.createActionHandler(
        this.props.element,
        behaviorElement,
        this.props.onUpdate,
      ),
    );
    const onVisible = () => visibleHandlers.forEach(h => h());

    return React.createElement(
      VisibilityDetectingView,
      { onInvisible: null, onVisible, style: this.getStyle() },
      children,
    );
  };

  render() {
    // Render the component based on the XML element. Depending on the applied behaviors,
    // this component will be wrapped with others to provide the necessary interaction.
    const children = Render.renderElement(
      this.props.element,
      this.props.stylesheets,
      this.props.onUpdate,
      { ...this.props.options, pressed: this.state.pressed, skipHref: true },
    );

    const { ScrollableView, TouchableView, VisibilityView } = this;

    return (
      <VisibilityView>
        <ScrollableView>
          <TouchableView>{children || null}</TouchableView>
        </ScrollableView>
      </VisibilityView>
    );
  }
}

export const addHref = (
  component: any,
  element: Element,
  stylesheets: StyleSheets,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
) => {
  const href = element.getAttribute('href');
  const action = element.getAttribute('action');
  const childNodes = element.childNodes ? Array.from(element.childNodes) : [];
  const behaviorElements = childNodes.filter(
    n => n && n.nodeType === 1 && n.tagName === 'behavior',
  );
  const hasBehaviors = href || action || behaviorElements.length > 0;
  if (!hasBehaviors) {
    return component;
  }

  return React.createElement(
    HyperRef,
    { element, onUpdate, options, stylesheets },
    ...Render.renderChildren(element, stylesheets, onUpdate, options),
  );
};
