import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import {
  BEHAVIOR_ATTRIBUTES,
  LOCAL_NAME,
  PRESS_TRIGGERS,
  TRIGGERS,
} from 'hyperview/src/types';
import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  PressTrigger,
  StyleSheet,
  StyleSheets,
  Trigger,
} from 'hyperview/src/types';
import type { PressHandlers, PressPropName, Props, State } from './types';
import React, { PureComponent } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { BackBehaviorContext } from 'hyperview/src/contexts/back-behaviors';
import { PRESS_TRIGGERS_PROP_NAMES } from './types';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  static contextType = BackBehaviorContext;

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

    // Register behavior elements for back triggers
    this.addBackBehaviors();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.element === this.props.element) {
      return;
    }

    // Deregister event listener for back triggers
    this.removeBackBehaviors();

    this.updateBehaviorElements();
    this.updateStyle();
    this.triggerLoadBehaviors();
    // Register behavior elements for back triggers
    this.addBackBehaviors();
  }

  componentWillUnmount() {
    // Remove event listener for on-event triggers to avoid memory leaks
    Events.unsubscribe(this.onEventDispatch);
    // Deregister event listener for back triggers
    this.removeBackBehaviors();
  }

  updateBehaviorElements = () => {
    // Retrieve and cache behavior elements when element is updated
    this.behaviorElements = Dom.getBehaviorElements(this.props.element);
  };

  addBackBehaviors = () => {
    this.context?.add(
      this.getBehaviorElements(TRIGGERS.BACK),
      this.props.onUpdate,
    );
  };

  removeBackBehaviors = () => {
    this.context?.remove(this.getBehaviorElements(TRIGGERS.BACK));
  };

  updateStyle = () => {
    // Retrieve and cache style
    const styleAttr = this.props.element.getAttribute(
      BEHAVIOR_ATTRIBUTES.HREF_STYLE,
    );
    this.style = styleAttr
      ? styleAttr.split(' ').map(s => this.props.stylesheets.regular[s])
      : null;
  };

  onEventDispatch = (eventName: string) => {
    const behaviorElements = Dom.getBehaviorElements(this.props.element);
    const onEventBehaviors = behaviorElements.filter(e => {
      if (e.getAttribute(BEHAVIOR_ATTRIBUTES.TRIGGER) === TRIGGERS.ON_EVENT) {
        const currentAttributeEventName:
          | string
          | null
          | undefined = e.getAttribute('event-name');
        const currentAttributeAction:
          | string
          | null
          | undefined = e.getAttribute('action');
        if (currentAttributeAction === 'dispatch-event') {
          Logging.error(
            new Error(
              'trigger="on-event" and action="dispatch-event" cannot be used on the same element',
            ),
          );
          return false;
        }
        if (!currentAttributeEventName) {
          Logging.error(
            new Error('on-event trigger requires an event-name attribute'),
          );
          return false;
        }
        return currentAttributeEventName === eventName;
      }
      return false;
    });
    onEventBehaviors.forEach(behaviorElement => {
      const handler = Behaviors.createActionHandler(
        behaviorElement,
        this.props.onUpdate,
      );
      handler(this.props.element);

      Logging.info(
        '[on-event] trigger [',
        Logging.deferredToString(() => {
          return behaviorElement.getAttribute('event-name');
        }),
        '] caught by: ',
        Logging.deferredToString(() => {
          const listenerElement: Element = behaviorElement.cloneNode(
            false,
          ) as Element;
          return new XMLSerializer().serializeToString(listenerElement);
        }),
      );
    });
  };

  getBehaviorElements = (trigger: Trigger): Element[] => {
    return this.behaviorElements.filter(
      e => e.getAttribute(BEHAVIOR_ATTRIBUTES.TRIGGER) === trigger,
    );
  };

  getStyle = (): StyleSheet | null | undefined => {
    const styleAttr = this.props.element.getAttribute(
      BEHAVIOR_ATTRIBUTES.HREF_STYLE,
    );
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

    if (loadBehaviors.length > 0) {
      Behaviors.triggerBehaviors(
        this.props.element,
        loadBehaviors,
        this.props.onUpdate,
      );
    }
  };

  TouchableView = ({ children }: { children: JSX.Element }): JSX.Element => {
    const behaviors = this.behaviorElements.filter(
      e =>
        PRESS_TRIGGERS.indexOf(
          (e.getAttribute(BEHAVIOR_ATTRIBUTES.TRIGGER) ||
            TRIGGERS.PRESS) as PressTrigger,
        ) >= 0,
    );

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
        behaviorElement.getAttribute(BEHAVIOR_ATTRIBUTES.TRIGGER) ||
        TRIGGERS.PRESS;
      const triggerPropName =
        PRESS_TRIGGERS_PROP_NAMES[trigger as PressTrigger];
      const handler = Behaviors.createActionHandler(
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
        pressHandlers[
          triggerPropName as PressPropName
        ] = createEventHandler(() => handler(this.props.element));
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
      // Fix a conflict between onPressOut and onPress triggering at the same time.
      if (pressHandlers.onPress) {
        const onPressHandler = pressHandlers.onPress;
        pressHandlers.onPress = createEventHandler(() => {
          setTimeout(onPressHandler, time);
        });
      }
    }

    const style = this.getStyle();
    const { accessibilityLabel, testID } = createTestProps(this.props.element);
    const { onLongPress, onPress, onPressIn, onPressOut } = pressHandlers;

    // If element is a <text> nested under another <text>, simply add press events
    const isNestedUnderText =
      (this.props.element.parentNode as Element)?.namespaceURI ===
        Namespaces.HYPERVIEW &&
      (this.props.element.parentNode as Element)?.localName === LOCAL_NAME.TEXT;

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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore TS2300: no overload matches this call
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

  ScrollableView = ({ children }: { children: JSX.Element }): JSX.Element => {
    const behaviors = this.getBehaviorElements(TRIGGERS.REFRESH);
    if (!behaviors.length) {
      return children;
    }
    const refreshHandlers = behaviors.map(behaviorElement =>
      Behaviors.createActionHandler(behaviorElement, this.props.onUpdate),
    );
    const onRefresh = () => refreshHandlers.forEach(h => h(this.props.element));
    const refreshControl = React.createElement(RefreshControl, {
      onRefresh,
      refreshing: this.state.refreshing,
    });
    return React.createElement(
      ScrollView,
      {
        refreshControl,
        showsVerticalScrollIndicator:
          this.props.element.getAttribute('shows-scroll-indicator') !== 'false',
        style: this.getStyle(),
      },
      children,
    );
  };

  VisibilityView = ({ children }: { children: JSX.Element }): JSX.Element => {
    const behaviors = this.getBehaviorElements(TRIGGERS.VISIBLE);
    if (!behaviors.length) {
      return children;
    }
    const onVisible = () => {
      // We don't want to use the cached `behaviors` list here because
      // the DOM might have been mutated since.
      this.getBehaviorElements(TRIGGERS.VISIBLE)
        .map(behaviorElement =>
          Behaviors.createActionHandler(behaviorElement, this.props.onUpdate),
        )
        .forEach(h => h(this.props.element));
    };

    // If element does not have an `id` attribute, generate a pseudo id from list of attributes
    // This is necessary to indicate to the VisibilityDetectingView that the element has changed
    // and the internal state needs to be reset.
    const id =
      this.props.element.getAttribute('id') ||
      Object.values(BEHAVIOR_ATTRIBUTES)
        .reduce((acc: string[], name: string) => {
          const value = this.props.element.getAttribute(name);
          return value ? [...acc, `${name}:${value}`] : acc;
        }, [])
        .join('_');

    return React.createElement(
      VisibilityDetectingView,
      {
        id,
        onInvisible: null,
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
          <TouchableView>{(children as JSX.Element) || null}</TouchableView>
        </ScrollableView>
      </VisibilityView>
    );
  }
}

export const addHref = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    n => n && n.nodeType === 1 && (n as Element).tagName === 'behavior',
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
