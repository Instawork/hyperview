// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Render from 'hyperview/src/services/render';
import type { Props, State } from './types';
import React, { PureComponent } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import VisibilityDetectingView from 'hyperview/src/VisibilityDetectingView';
import { getBehaviorElements } from 'hyperview/src/services';

/**
 * Component that handles dispatching behaviors based on the appropriate
 * triggers.
 */
export default class HyperRef extends PureComponent<Props, State> {
  props: Props;
  state: State;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      pressed: false,
    };

    this.pressTriggerPropNames = {
      press: 'onPress',
      longPress: 'onLongPress',
      pressIn: 'onPressIn',
      pressOut: 'onPressOut',
    };

    this.pressTriggers = ['press', 'longPress', 'pressIn', 'pressOut'];
    this.navActions = ['push', 'new', 'back', 'close', 'navigate'];
    this.updateActions = ['replace', 'replace-inner', 'append', 'prepend'];
  }

  componentDidMount() {
    const { element, onUpdate } = this.props;
    const behaviorElements = getBehaviorElements(element);
    const loadBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === 'load',
    );

    loadBehaviors.forEach(behaviorElement => {
      const handler = this.createActionHandler(
        element,
        behaviorElement,
        onUpdate,
      );
      setTimeout(handler, 0);
    });
  }

  componentDidUpdate(prevProps) {
    const { element, onUpdate } = this.props;
    if (prevProps.element === element) {
      return;
    }
    const behaviorElements = getBehaviorElements(element);
    const loadBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === 'load',
    );
    loadBehaviors.forEach(behaviorElement => {
      const handler = this.createActionHandler(
        element,
        behaviorElement,
        onUpdate,
      );
      setTimeout(handler, 0);
    });
  }

  createActionHandler = (element, behaviorElement, onUpdate) => {
    const action = behaviorElement.getAttribute('action') || 'push';

    if (this.navActions.indexOf(action) >= 0) {
      return () => {
        const href = behaviorElement.getAttribute('href');
        const showIndicatorId = behaviorElement.getAttribute(
          'show-during-load',
        );
        const delay = behaviorElement.getAttribute('delay');
        onUpdate(href, action, element, { showIndicatorId, delay });
      };
    } else if (this.updateActions.indexOf(action) >= 0) {
      return () => {
        const href = behaviorElement.getAttribute('href');
        const verb = behaviorElement.getAttribute('verb');
        const targetId = behaviorElement.getAttribute('target');
        const showIndicatorIds = behaviorElement.getAttribute(
          'show-during-load',
        );
        const hideIndicatorIds = behaviorElement.getAttribute(
          'hide-during-load',
        );
        const delay = behaviorElement.getAttribute('delay');
        const once = behaviorElement.getAttribute('once');
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

  render() {
    const { refreshing, pressed } = this.state;
    const { element, stylesheets, onUpdate, options } = this.props;
    const behaviorElements = getBehaviorElements(element);
    const pressBehaviors = behaviorElements.filter(
      e =>
        this.pressTriggers.indexOf(e.getAttribute('trigger') || 'press') >= 0,
    );
    const visibleBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === 'visible',
    );
    const refreshBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === 'refresh',
    );

    // Render the component based on the XML element. Depending on the applied behaviors,
    // this component will be wrapped with others to provide the necessary interaction.
    let renderedComponent = Render.renderElement(
      element,
      stylesheets,
      onUpdate,
      { ...options, pressed, skipHref: true },
    );

    const styleAttr = element.getAttribute('href-style');
    const hrefStyle = styleAttr
      ? styleAttr.split(' ').map(s => stylesheets.regular[s])
      : null;

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
        const trigger = behaviorElement.getAttribute('trigger') || 'press';
        const triggerPropName = this.pressTriggerPropNames[trigger];
        const handler = this.createActionHandler(
          element,
          behaviorElement,
          onUpdate,
        );
        if (props[triggerPropName]) {
          const oldHandler = props[triggerPropName];
          props[triggerPropName] = () => {
            oldHandler();
            setTimeout(handler, time);
            time += 1;
          };
        } else {
          props[triggerPropName] = handler;
        }
      });

      if (props.onPressIn) {
        const oldHandler = props.onPressIn;
        props.onPressIn = () => {
          this.setState({ pressed: true });
          oldHandler();
        };
      } else {
        props.onPressIn = () => {
          this.setState({ pressed: true });
        };
      }

      if (props.onPressOut) {
        const oldHandler = props.onPressOut;
        props.onPressOut = () => {
          this.setState({ pressed: false });
          oldHandler();
        };
      } else {
        props.onPressOut = () => {
          this.setState({ pressed: false });
        };
      }

      // Fix a conflict between onPressOut and onPress triggering at the same time.
      if (props.onPressOut && props.onPress) {
        const onPressHandler = props.onPress;
        props.onPress = () => {
          setTimeout(onPressHandler, time);
        };
      }

      renderedComponent = React.createElement(
        TouchableOpacity,
        props,
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
