// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Render from 'hyperview/src/services/render';
import { ATTRIBUTES, PRESS_TRIGGERS_PROP_NAMES } from './types';
import type {
  Element,
  HvComponentOnUpdate,
  PressTrigger,
} from 'hyperview/src/types';
import {
  NAV_ACTIONS,
  ON_EVENT_DISPATCH,
  PRESS_TRIGGERS,
  TRIGGERS,
  UPDATE_ACTIONS,
} from 'hyperview/src/types';
import type { PressHandlers, Props, State } from './types';
import React, { PureComponent } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import VisibilityDetectingView from 'hyperview/src/VisibilityDetectingView';
import { XMLSerializer } from 'xmldom';
// eslint-disable-next-line import/no-internal-modules
import eventEmitter from 'tiny-emitter/instance';
import { getBehaviorElements } from 'hyperview/src/services';
import { EventSourceContext } from 'hyperview/src/components/hv-event-source';

/**
 * Component that handles dispatching behaviors based on the appropriate
 * triggers.
 */
export default class HyperRef extends PureComponent<Props, State> {
  props: Props;
  state: State = {
    refreshing: false,
    pressed: false,
  };

  static contextType = EventSourceContext;

  componentDidMount() {
    this.triggerLoadBehaviors();

    // Register event listener for on-event triggers
    eventEmitter.on(ON_EVENT_DISPATCH, this.onEventDispatch);

    if (this.context) {
      const eventNames = getBehaviorElements(this.props.element)
        .filter(e => e.getAttribute(ATTRIBUTES.TRIGGER) === TRIGGERS.ON_EVENT)
        .map(e => e.getAttribute('event-name'));
      this.context.registerEvents(eventNames);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.element === this.props.element) {
      return;
    }
    this.triggerLoadBehaviors();
  }

  componentWillUnmount() {
    // Remove event listener for on-event triggers to avoid memory leaks
    eventEmitter.off(ON_EVENT_DISPATCH, this.onEventDispatch);
  }

  onEventDispatch = (eventName: string) => {
    const behaviorElements = getBehaviorElements(this.props.element);
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

    if (Object.values(NAV_ACTIONS).indexOf(action) >= 0) {
      return () => {
        const href = behaviorElement.getAttribute(ATTRIBUTES.HREF);
        const showIndicatorId = behaviorElement.getAttribute(
          ATTRIBUTES.SHOW_DURING_LOAD,
        );
        const delay = behaviorElement.getAttribute(ATTRIBUTES.DELAY);
        onUpdate(href, action, element, { showIndicatorId, delay });
      };
    } else if (Object.values(UPDATE_ACTIONS).indexOf(action) >= 0) {
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
          verb,
          targetId,
          showIndicatorIds,
          hideIndicatorIds,
          delay,
          once,
        });
      };
    }
    //
    // Custom behavior
    return () =>
      onUpdate(null, action, element, { custom: true, behaviorElement });
  };

  triggerLoadBehaviors = () => {
    const behaviorElements = getBehaviorElements(this.props.element);
    const loadBehaviors = behaviorElements.filter(
      e => e.getAttribute(ATTRIBUTES.TRIGGER) === TRIGGERS.LOAD,
    );

    loadBehaviors.forEach(behaviorElement => {
      const handler = this.createActionHandler(
        this.props.element,
        behaviorElement,
        this.props.onUpdate,
      );
      setTimeout(handler, 0);
    });
  };

  render() {
    const { refreshing, pressed } = this.state;
    const { element, stylesheets, onUpdate, options } = this.props;
    const behaviorElements = getBehaviorElements(element);
    const pressBehaviors = behaviorElements.filter(
      e =>
        PRESS_TRIGGERS.indexOf(
          e.getAttribute(ATTRIBUTES.TRIGGER) || TRIGGERS.PRESS,
        ) >= 0,
    );
    const visibleBehaviors = behaviorElements.filter(
      e => e.getAttribute(ATTRIBUTES.TRIGGER) === TRIGGERS.VISIBLE,
    );
    const refreshBehaviors = behaviorElements.filter(
      e => e.getAttribute(ATTRIBUTES.TRIGGER) === TRIGGERS.REFRESH,
    );

    // Render the component based on the XML element. Depending on the applied behaviors,
    // this component will be wrapped with others to provide the necessary interaction.
    let renderedComponent = Render.renderElement(
      element,
      stylesheets,
      onUpdate,
      { ...options, pressed, skipHref: true },
    );

    const styleAttr = element.getAttribute(ATTRIBUTES.HREF_STYLE);
    const hrefStyle = styleAttr
      ? styleAttr.split(' ').map(s => stylesheets.regular[s])
      : null;

    const pressHandlers: PressHandlers = {};

    // Render pressable element
    if (pressBehaviors.length > 0) {
      const props = {
        // Component will use touchable opacity to trigger href.
        activeOpacity: 1,
        style: hrefStyle,
      };

      // With multiple behaviors for the same trigger, we need to stagger
      // the updates a bit so that each update operates on the latest DOM.
      // Ideally, we could apply multiple DOM updates at a time.
      let time = 0;

      pressBehaviors.forEach(behaviorElement => {
        const trigger: PressTrigger =
          behaviorElement.getAttribute(ATTRIBUTES.TRIGGER) || TRIGGERS.PRESS;
        const triggerPropName = PRESS_TRIGGERS_PROP_NAMES[trigger];
        const handler = this.createActionHandler(
          element,
          behaviorElement,
          onUpdate,
        );
        if (pressHandlers[triggerPropName]) {
          const oldHandler = pressHandlers[triggerPropName];
          pressHandlers[triggerPropName] = () => {
            oldHandler();
            setTimeout(handler, time);
            time += 1;
          };
        } else {
          pressHandlers[triggerPropName] = handler;
        }
      });

      if (pressHandlers.onPressIn) {
        const oldHandler = pressHandlers.onPressIn;
        pressHandlers.onPressIn = () => {
          this.setState({ pressed: true });
          oldHandler();
        };
      } else {
        pressHandlers.onPressIn = () => {
          this.setState({ pressed: true });
        };
      }

      if (pressHandlers.onPressOut) {
        const oldHandler = pressHandlers.onPressOut;
        pressHandlers.onPressOut = () => {
          this.setState({ pressed: false });
          oldHandler();
        };
      } else {
        pressHandlers.onPressOut = () => {
          this.setState({ pressed: false });
        };
      }

      // Fix a conflict between onPressOut and onPress triggering at the same time.
      if (pressHandlers.onPressOut && pressHandlers.onPress) {
        const onPressHandler = pressHandlers.onPress;
        pressHandlers.onPress = () => {
          setTimeout(onPressHandler, time);
        };
      }

      renderedComponent = React.createElement(
        TouchableOpacity,
        { ...props, ...pressHandlers },
        renderedComponent,
      );
    }

    // Wrap component in a scrollview with a refresh control to trigger
    // the refresh behaviors.
    if (refreshBehaviors.length > 0) {
      const refreshHandlers = refreshBehaviors.map(behaviorElement =>
        this.createActionHandler(element, behaviorElement, onUpdate),
      );
      const onRefresh = () => refreshHandlers.forEach(h => h());

      const refreshControl = React.createElement(RefreshControl, {
        refreshing,
        onRefresh,
      });
      renderedComponent = React.createElement(
        ScrollView,
        { refreshControl, style: hrefStyle },
        renderedComponent,
      );
    }

    // Wrap component in a VisibilityDetectingView to trigger visibility behaviors.
    if (visibleBehaviors.length > 0) {
      const visibleHandlers = visibleBehaviors.map(behaviorElement =>
        this.createActionHandler(element, behaviorElement, onUpdate),
      );
      const onVisible = () => visibleHandlers.forEach(h => h());

      renderedComponent = React.createElement(
        VisibilityDetectingView,
        { onVisible, style: hrefStyle },
        renderedComponent,
      );
    }

    return renderedComponent;
  }
}
