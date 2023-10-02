/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import {
  ACTIONS,
  LOCAL_NAME,
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
  NavAction,
  PressTrigger,
  StyleSheet,
  StyleSheets,
  Trigger,
  UpdateAction,
} from 'hyperview/src/types';
import type { PressHandlers, PressPropName, Props, State } from './types';
import React, { PureComponent, ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import VisibilityDetectingView from 'hyperview/src/VisibilityDetectingView';
import { XMLSerializer } from '@instawork/xmldom';
import { X_RESPONSE_STALE_REASON } from 'hyperview/src/services/dom/types';
import { createTestProps } from 'hyperview/src/services';
/**
 * Wrapper to handle UI events
 * Stop propagation and prevent default client behavior
 * This prevents clicks on various elements to trigger browser navigation
 * when using Hyperview for web.
 */
export const createEventHandler = (
  handler: () => void,
  preventDefault = false,
): ((event?: any) => void) => event => {
  if (preventDefault) {
    event?.preventDefault();
  }
  handler();
};

/**
 * Component that handles dispatching behaviors based on the appropriate
 * triggers.
 */
export default class HyperRef extends PureComponent<Props, State> {
  state: State = {
    pressed: false,
    refreshing: false,
  };

  behaviorElements: Element[] = [];

  style: StyleSheet | null | undefined;

  constructor(props: Props, state: State) {
    super(props, state);
    this.updateBehaviorElements();
    this.updateStyle();
  }

  componentDidMount() {
    this.triggerLoadBehaviors();

    // Register event listener for on-event triggers
    Events.subscribe(this.onEventDispatch);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.element === this.props.element) {
      return;
    }

    this.updateBehaviorElements();
    this.updateStyle();
    this.triggerLoadBehaviors();
  }

  componentWillUnmount() {
    // Remove event listener for on-event triggers to avoid memory leaks
    Events.unsubscribe(this.onEventDispatch);
  }

  updateBehaviorElements = () => {
    // Retrieve and cache behavior elements when element is updated
    this.behaviorElements = Dom.getBehaviorElements(this.props.element);
  };

  updateStyle = () => {
    // Retrieve and cache style
    const styleAttr = this.props.element.getAttribute(ATTRIBUTES.HREF_STYLE);
    this.style = styleAttr
      ? styleAttr.split(' ').map(s => this.props.stylesheets.regular[s])
      : null;
  };

  onEventDispatch = (eventName: string) => {
    const behaviorElements = Dom.getBehaviorElements(this.props.element);
    const onEventBehaviors = behaviorElements.filter(e => {
      if (e.getAttribute(ATTRIBUTES.TRIGGER) === TRIGGERS.ON_EVENT) {
        const currentAttributeEventName:
          | string
          | null
          | undefined = e.getAttribute('event-name');
        const currentAttributeAction:
          | string
          | null
          | undefined = e.getAttribute('action');
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
        behaviorElement,
        this.props.onUpdate,
      );
      handler(this.props.element);
      if (__DEV__) {
        const listenerElement: Element = behaviorElement.cloneNode(false);
        const caughtEvent:
          | string
          | undefined
          | null = behaviorElement.getAttribute('event-name');
        const serializer = new XMLSerializer();
        console.log(
          `[on-event] trigger [${caughtEvent}] caught by:`,
          serializer.serializeToString(listenerElement),
        );
      }
    });
  };

  createActionHandler = (
    behaviorElement: Element,
    onUpdate: HvComponentOnUpdate,
  ) => {
    const action =
      behaviorElement.getAttribute(ATTRIBUTES.ACTION) || NAV_ACTIONS.PUSH;
    if (Object.values(NAV_ACTIONS).indexOf(action as NavAction) >= 0) {
      return (element: Element) => {
        const href = behaviorElement.getAttribute(ATTRIBUTES.HREF);
        const targetId = behaviorElement.getAttribute(ATTRIBUTES.TARGET);
        const showIndicatorId = behaviorElement.getAttribute(
          ATTRIBUTES.SHOW_DURING_LOAD,
        );
        const delay = behaviorElement.getAttribute(ATTRIBUTES.DELAY);
        onUpdate(href, action, element, { delay, showIndicatorId, targetId });
      };
    }
    if (
      action === ACTIONS.RELOAD ||
      Object.values(UPDATE_ACTIONS).indexOf(action as UpdateAction) >= 0
    ) {
      return (element: Element) => {
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
    return (element: Element) => {
      return onUpdate(null, action, element, { behaviorElement, custom: true });
    };
  };

  getBehaviorElements = (trigger: Trigger): Element[] => {
    return this.behaviorElements.filter(
      e => e.getAttribute(ATTRIBUTES.TRIGGER) === trigger,
    );
  };

  getStyle = (): StyleSheet | null | undefined => {
    const styleAttr = this.props.element.getAttribute(ATTRIBUTES.HREF_STYLE);
    return styleAttr
      ? styleAttr.split(' ').map(s => this.props.stylesheets.regular[s])
      : null;
  };

  triggerLoadBehaviors = () => {
    let loadBehaviors = this.getBehaviorElements(TRIGGERS.LOAD);
    if (
      this.props.options?.staleHeaderType ===
      X_RESPONSE_STALE_REASON.STALE_IF_ERROR
    ) {
      const loadStaleBehaviors = this.getBehaviorElements(
        TRIGGERS.LOAD_STALE_ERROR,
      );
      loadBehaviors = loadBehaviors.concat(loadStaleBehaviors);
    }
    loadBehaviors.forEach(behaviorElement => {
      const handler = this.createActionHandler(
        behaviorElement,
        this.props.onUpdate,
      );
      if (behaviorElement.getAttribute(ATTRIBUTES.IMMEDIATE) === 'true') {
        handler(this.props.element);
      } else {
        setTimeout(() => handler(this.props.element), 0);
      }
    });
  };

  TouchableView = ({ children }: { children: ReactNode }): ReactNode => {
    const behaviors = this.behaviorElements.filter(e => {
      const trigger = e.getAttribute(ATTRIBUTES.TRIGGER) || TRIGGERS.PRESS;
      return PRESS_TRIGGERS.indexOf(trigger as PressTrigger) >= 0;
    });

    if (!behaviors.length) {
      return children;
    }

    // With multiple behaviors for the same trigger, we need to stagger
    // the updates a bit so that each update operates on the latest DOM.
    // Ideally, we could apply multiple DOM updates at a time.
    let time = 0;

    const pressHandlers: PressHandlers = {};

    behaviors.forEach(behaviorElement => {
      const trigger =
        behaviorElement.getAttribute(ATTRIBUTES.TRIGGER) || TRIGGERS.PRESS;
      const triggerPropName =
        PRESS_TRIGGERS_PROP_NAMES[trigger as PressTrigger];
      const handler = this.createActionHandler(
        behaviorElement,
        this.props.onUpdate,
      );
      const pressHandler = pressHandlers[triggerPropName as PressPropName];
      if (pressHandler) {
        const oldHandler = pressHandler;
        pressHandlers[triggerPropName as PressPropName] = createEventHandler(
          () => {
            oldHandler();
            setTimeout(() => handler(this.props.element), time);
            time += 1;
          },
        );
      } else {
        pressHandlers[triggerPropName as PressPropName] = createEventHandler(
          () => {
            return handler(this.props.element);
          },
        );
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

    const delayOnPress = () => {
      // Fix a conflict between onPressOut and onPress triggering at the same time.
      if (pressHandlers.onPress) {
        const onPressHandler = pressHandlers.onPress;
        pressHandlers.onPress = createEventHandler(() => {
          setTimeout(onPressHandler, time);
        });
      }
    };

    if (pressHandlers.onPressOut) {
      const oldHandler = pressHandlers.onPressOut;
      pressHandlers.onPressOut = createEventHandler(() => {
        this.setState({ pressed: false });
        oldHandler();
      });
      delayOnPress();
    } else {
      pressHandlers.onPressOut = createEventHandler(() => {
        this.setState({ pressed: false });
      });
      delayOnPress();
    }

    const style = this.getStyle();
    const { accessibilityLabel, testID } = createTestProps(this.props.element);
    const { onLongPress, onPress, onPressIn, onPressOut } = pressHandlers;

    // If element is a <text> nested under another <text>, simply add press events
    const isNestedUnderText =
      this.props.element.parentNode?.namespaceURI === Namespaces.HYPERVIEW &&
      this.props.element.parentNode?.localName === LOCAL_NAME.TEXT;

    if (isNestedUnderText) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const noop = () => {};
      return (
        <Text
          accessibilityLabel={accessibilityLabel}
          accessible={false}
          onLongPress={onLongPress}
          // when no press handler set, we still need an empty handler for pressIn or pressOut
          // handlers to work
          onPress={
            onPress ||
            (onPressIn !== undefined || onPressOut !== undefined
              ? noop
              : undefined)
          }
          onResponderGrant={onPressIn}
          // Both release and terminate responder are needed to properly pressOut
          onResponderRelease={onPressOut}
          onResponderTerminate={onPressOut}
          style={style}
          suppressHighlighting
          testID={testID}
        >
          {children}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        accessible={false}
        activeOpacity={1}
        onLongPress={onLongPress}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={style}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  };

  ScrollableView = ({ children }: { children: ReactNode }): ReactNode => {
    const behaviors = this.getBehaviorElements(TRIGGERS.REFRESH);
    if (!behaviors.length) {
      return children;
    }
    const refreshHandlers = behaviors.map(behaviorElement => {
      return this.createActionHandler(behaviorElement, this.props.onUpdate);
    });
    const onRefresh = () => refreshHandlers.forEach(h => h(this.props.element));

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

  VisibilityView = ({ children }: { children: ReactNode }): ReactNode => {
    const behaviors = this.getBehaviorElements(TRIGGERS.VISIBLE);
    if (!behaviors.length) {
      return children;
    }
    const onVisible = () => {
      // We don't want to use the cached `behaviors` list here because
      // the DOM might have been mutated since.
      this.getBehaviorElements(TRIGGERS.VISIBLE)
        .map(behaviorElement => {
          return this.createActionHandler(behaviorElement, this.props.onUpdate);
        })
        .forEach(h => h(this.props.element));
    };

    // If element does not have an `id` attribute, generate a pseudo id from list of attributes
    // This is necessary to indicate to the VisibilityDetectingView that the element has changed
    // and the internal state needs to be reset.
    const id =
      this.props.element.getAttribute('id') ||
      Object.values(ATTRIBUTES)
        // $FlowFixMe: every value in ATTRIBUTES are strings
        .reduce((acc: string[], name: string) => {
          const value = this.props.element.getAttribute(name);
          return value ? [...acc, `${name}:${value}`] : acc;
        }, [])
        .join('_');

    return React.createElement(
      VisibilityDetectingView,
      {
        id,
        onInvisible: () => {
          return null;
        },
        onVisible,
        style: this.getStyle(),
      },
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
