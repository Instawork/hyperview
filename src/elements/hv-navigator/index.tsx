import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Contexts from 'hyperview/src/contexts';
import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigatorService from 'hyperview/src/services/navigator';
import {
  BEHAVIOR_ATTRIBUTES,
  LOCAL_NAME,
  RouteParams,
  TRIGGERS,
} from 'hyperview/src/types';
import type {
  ParamTypes,
  Props,
  ScreenParams,
  StackScreenOptions,
  TabScreenOptions,
} from './types';
import React, { PureComponent } from 'react';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { Context as NavigationContext } from 'hyperview/src/contexts/navigation';
import { Platform } from 'react-native';
import { createCustomStackNavigator } from 'hyperview/src/core/components/navigator-stack';
import { createCustomTabNavigator } from 'hyperview/src/core/components/navigator-tab';
import { getFirstChildTag } from 'hyperview/src/services/dom/helpers';

/**
 * Flag to show the default navigator UIs
 * Example: tab bar
 * NOTE: This will only be used if no footer element is provided for a tabbar
 */
const SHOW_DEFAULT_FOOTER_UI = false;

/**
 * Flag to show the header UIs
 */
const SHOW_DEFAULT_HEADER_UI = false;

const Stack = createCustomStackNavigator<ParamTypes>();
const BottomTab = createCustomTabNavigator<ParamTypes>();

export default class HvNavigator extends PureComponent<Props> {
  behaviorElements: Element[] = [];

  constructor(props: Props) {
    super(props);
    this.updateBehaviorElements();
  }

  componentDidMount() {
    this.triggerLoadBehaviors();
    Events.subscribe(this.onEventDispatch);
  }

  componentWillUnmount = () => {
    Events.unsubscribe(this.onEventDispatch);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.element === this.props.element) {
      return;
    }

    this.updateBehaviorElements();
    this.triggerLoadBehaviors();
  }

  onEventDispatch = (eventName: string) => {
    const onEventBehaviors = this.behaviorElements.filter(e => {
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
      if (!this.props.element) {
        return;
      }
      handler(this.props.element);
    });
  };

  /**
   * Cache all behaviors with a `load` trigger
   */
  updateBehaviorElements = () => {
    const supportedTriggers: string[] = [TRIGGERS.LOAD, TRIGGERS.ON_EVENT];
    if (this.props.element) {
      this.behaviorElements = Dom.getBehaviorElements(
        this.props.element,
      ).filter(e => {
        const triggerAttr =
          e.getAttribute(BEHAVIOR_ATTRIBUTES.TRIGGER) || 'press';
        if (!supportedTriggers.includes(triggerAttr)) {
          Logging.warn(
            `Unsupported trigger '${triggerAttr}'. Only "${supportedTriggers.join(
              ',',
            )}" are supported`,
          );
          return false;
        }
        return true;
      });
    }
  };

  triggerLoadBehaviors = () => {
    const loadBehaviors = this.behaviorElements.filter(
      e => e.getAttribute(BEHAVIOR_ATTRIBUTES.TRIGGER) === TRIGGERS.LOAD,
    );
    if (loadBehaviors.length > 0 && this.props.element) {
      Behaviors.triggerBehaviors(
        this.props.element,
        loadBehaviors,
        this.props.onUpdate,
      );
    }
  };

  /**
   * Encapsulated options for the stack screenOptions
   */
  stackScreenOptions = (route: ScreenParams): StackScreenOptions => ({
    headerMode: 'screen',
    headerShown: SHOW_DEFAULT_HEADER_UI,
    title: this.getId(route.params),
  });

  /**
   * Encapsulated options for the tab screenOptions
   */
  tabScreenOptions = (route: ScreenParams): TabScreenOptions => ({
    headerShown: SHOW_DEFAULT_HEADER_UI,
    tabBarStyle: {
      display: SHOW_DEFAULT_FOOTER_UI ? 'flex' : 'none',
    },
    title: this.getId(route.params),
  });

  /**
   * Logic to determine the nav route id
   */
  getId = (params: RouteParams): string => {
    if (!params) {
      throw new NavigatorService.HvNavigatorError('No params found for route');
    }
    if (params.id) {
      if (NavigatorService.isDynamicRoute(params.id)) {
        // Dynamic routes use their url as id
        return params.url || params.id;
      }
      return params.id;
    }
    return params.url || '';
  };

  /**
   * Build an individual screen
   */
  buildScreen = (
    id: string,
    type: string,
    href: string | undefined,
    needsSubStack: boolean,
    isFirstScreen = false,
    routeId?: string | undefined,
    isModal = false,
  ): React.ReactElement => {
    const initialParams = NavigatorService.isDynamicRoute(id)
      ? {}
      : { id, isModal, needsSubStack, routeId, url: href };
    if (type === NavigatorService.NAVIGATOR_TYPE.TAB) {
      return (
        <BottomTab.Screen
          key={id}
          component={this.props.routeComponent}
          initialParams={initialParams}
          name={id}
        />
      );
    }
    if (type === NavigatorService.NAVIGATOR_TYPE.STACK) {
      const gestureEnabled = Platform.OS === 'ios' ? !needsSubStack : false;
      return (
        <Stack.Screen
          key={id}
          component={this.props.routeComponent}
          getId={({ params }: ScreenParams) => this.getId(params)}
          initialParams={initialParams}
          name={id}
          options={{
            animationEnabled: !isFirstScreen,
            cardStyleInterpolator: needsSubStack
              ? CardStyleInterpolators.forVerticalIOS
              : undefined,
            gestureEnabled,
            presentation: needsSubStack
              ? NavigatorService.ID_MODAL
              : NavigatorService.ID_CARD,
          }}
        />
      );
    }
    throw new NavigatorService.HvNavigatorError(
      `No navigator found for type '${type}'`,
    );
  };

  /**
   * Build the card and modal screens for a stack navigator
   */
  buildDynamicScreens = (): React.ReactElement[] => {
    const screens: React.ReactElement[] = [];

    screens.push(
      this.buildScreen(
        NavigatorService.ID_CARD,
        NavigatorService.NAVIGATOR_TYPE.STACK,
        undefined,
        false,
      ),
    );

    screens.push(
      this.buildScreen(
        NavigatorService.ID_MODAL,
        NavigatorService.NAVIGATOR_TYPE.STACK,
        undefined,
        true,
      ),
    );
    return screens;
  };

  /**
   * Build all screens from received routes
   */
  buildScreens = (type: string, element?: Element): React.ReactNode => {
    const screens: React.ReactElement[] = [];
    if (!element) {
      return screens;
    }
    const elements: Element[] = NavigatorService.getChildElements(element);

    // For tab navigators, the screens are appended
    // For stack navigators, defined routes are appened,
    // the dynamic screens are added later
    // This iteration will also process nested navigators
    //    and retrieve additional urls from child routes
    elements.forEach((navRoute: Element, index: number) => {
      if (navRoute.localName === LOCAL_NAME.NAV_ROUTE) {
        const id: string | null | undefined = navRoute.getAttribute('id');
        if (!id) {
          throw new NavigatorService.HvNavigatorError(
            `No id provided for ${navRoute.localName}`,
          );
        }
        const href: string | null | undefined = navRoute.getAttribute('href');
        const isModal =
          navRoute.getAttribute(NavigatorService.KEY_MODAL) === 'true';

        // Check for nested navigators
        const nestedNavigator: Element | null = getFirstChildTag(
          navRoute,
          LOCAL_NAME.NAVIGATOR,
        );

        if (!nestedNavigator && !href) {
          throw new NavigatorService.HvNavigatorError(
            `No href provided for route '${id}'`,
          );
        }
        // The first screen in each stack will omit the animation
        // This is to prevent the initial screen from animating in,
        //  including when the navigation hierarchy is reset
        // This relies on the schema requirement that each <navigator> has at least one <nav-route>
        screens.push(
          this.buildScreen(
            id,
            type,
            href || undefined,
            isModal,
            index === 0,
            id,
            isModal,
          ),
        );
      }
    });

    // Add the dynamic stack screens
    if (type === NavigatorService.NAVIGATOR_TYPE.STACK) {
      screens.push(...this.buildDynamicScreens());
    }
    return screens;
  };

  /**
   * Build the required navigator from the xml element
   */
  Navigator = (props: NavigatorService.NavigatorProps): React.ReactElement => {
    if (!this.props.element) {
      throw new NavigatorService.HvNavigatorError(
        'No element found for navigator',
      );
    }

    const id: string | null | undefined = this.props.element.getAttribute('id');
    if (!id) {
      throw new NavigatorService.HvNavigatorError('No id found for navigator');
    }

    const type: string | null | undefined = this.props.element.getAttribute(
      'type',
    );
    const selected:
      | Element
      | undefined = NavigatorService.getSelectedNavRouteElement(
      this.props.element,
    );

    const selectedId: string | undefined = selected
      ? selected.getAttribute('id')?.toString()
      : undefined;

    const { BottomTabBar } = props;

    switch (type) {
      case NavigatorService.NAVIGATOR_TYPE.STACK:
        return (
          <Stack.Navigator
            id={id}
            screenOptions={({ route }) => this.stackScreenOptions(route)}
          >
            {this.buildScreens(type, this.props.element)}
          </Stack.Navigator>
        );
      case NavigatorService.NAVIGATOR_TYPE.TAB:
        return (
          <BottomTab.Navigator
            backBehavior="none"
            id={id}
            initialRouteName={selectedId}
            screenOptions={({ route }) => this.tabScreenOptions(route)}
            tabBar={
              BottomTabBar &&
              (p => (
                <BottomTabBar
                  descriptors={p.descriptors}
                  id={id}
                  insets={p.insets}
                  navigation={p.navigation}
                  state={p.state}
                />
              ))
            }
          >
            {this.buildScreens(type, this.props.element)}
          </BottomTab.Navigator>
        );
      default:
    }
    throw new NavigatorService.HvNavigatorError(
      `No navigator type '${type}'found for '${id}'`,
    );
  };

  /**
   * Build a stack navigator for a modal
   */
  ModalNavigator = (
    props: NavigatorService.NavigatorProps,
  ): React.ReactElement => {
    if (!this.props.params) {
      throw new NavigatorService.HvNavigatorError(
        'No params found for modal screen',
      );
    }

    if (!this.props.params.id) {
      throw new NavigatorService.HvNavigatorError(
        'No id found for modal screen',
      );
    }

    const navigatorId = `stack-${this.props.params.id}`;
    const screenId = `modal-screen-${this.props.params.id}`;

    // Generate a simple structure for the modal
    const screens: React.ReactElement[] = [];
    screens.push(
      this.buildScreen(
        screenId,
        NavigatorService.NAVIGATOR_TYPE.STACK,
        this.props.params?.url || undefined,
        false,
        false,
        this.props.params.id,
        true,
      ),
    );
    screens.push(...this.buildDynamicScreens());

    // Mutate the dom to match
    if (props.doc) {
      const route: Element | null =
        Dom.getElementById(props.doc, this.props.params.id) || null;
      if (route && !NavigatorService.getNavigatorById(props.doc, navigatorId)) {
        const navigator = props.doc.createElementNS(
          Namespaces.HYPERVIEW,
          LOCAL_NAME.NAVIGATOR,
        );
        navigator.setAttribute('id', navigatorId);
        navigator.setAttribute('type', 'stack');
        const screen = props.doc.createElementNS(
          Namespaces.HYPERVIEW,
          LOCAL_NAME.NAV_ROUTE,
        );
        screen.setAttribute('id', screenId);
        navigator.appendChild(screen);
        route.appendChild(navigator);
      }
    }

    return (
      <Stack.Navigator
        id={navigatorId}
        screenOptions={({ route }) => this.stackScreenOptions(route)}
      >
        {screens}
      </Stack.Navigator>
    );
  };

  render() {
    const Navigator = this.props.params?.needsSubStack
      ? this.ModalNavigator
      : this.Navigator;
    return (
      <NavigationContext.Consumer>
        {navContext => (
          <Contexts.DocContext.Consumer>
            {docProvider => (
              <Navigator
                BottomTabBar={navContext?.navigationComponents?.BottomTabBar}
                doc={docProvider?.getDoc()}
              />
            )}
          </Contexts.DocContext.Consumer>
        )}
      </NavigationContext.Consumer>
    );
  }
}
