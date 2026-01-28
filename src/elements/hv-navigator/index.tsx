import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigatorService from 'hyperview/src/services/navigator';
import {
  BEHAVIOR_ATTRIBUTES,
  LOCAL_NAME,
  NAVIGATOR_TYPE,
  RouteParams,
  TRIGGERS,
} from 'hyperview/src/types';
import {
  BehaviorUnsupportedTriggerError,
  EventMissingNameError,
  EventTriggerError,
} from 'hyperview/src/errors';
import {
  ParamTypes,
  Props,
  SHOW_DEFAULT_FOOTER_UI,
  SHOW_DEFAULT_HEADER_UI,
  ScreenParams,
  StackScreenOptions,
  TabScreenOptions,
} from './types';
import React, { useCallback, useEffect, useRef } from 'react';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { HvDocContext } from 'hyperview/src/elements/hv-doc';
import NavigatorStack from 'hyperview/src/components/navigator-stack';
import NavigatorTab from 'hyperview/src/components/navigator-tab';
import { Platform } from 'react-native';
import { getFirstChildTag } from 'hyperview/src/services/dom/helpers';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

export const Stack = NavigatorStack<ParamTypes>();
export const BottomTab = NavigatorTab<ParamTypes>();

export default function HvNavigator(props: Props) {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, params, routeComponent } = props;
  const behaviorElements = useRef<Element[]>([]);
  const { navigationComponents } = useHyperview();
  const prevProps = useRef<Element | undefined>(undefined);

  const onEventDispatch = useCallback(
    (eventName: string) => {
      const onEventBehaviors = behaviorElements.current.filter(e => {
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
            Logging.error(new EventTriggerError(e));
            return false;
          }
          if (!currentAttributeEventName) {
            Logging.error(new EventMissingNameError(e));
            return false;
          }
          return currentAttributeEventName === eventName;
        }
        return false;
      });
      onEventBehaviors.forEach(behaviorElement => {
        const handler = Behaviors.createActionHandler(
          behaviorElement,
          onUpdate,
        );
        if (!element) {
          return;
        }
        handler(element);
      });
    },
    [element, onUpdate],
  );

  /**
   * Cache all behaviors with a `load` trigger
   */
  const updateBehaviorElements = useCallback(() => {
    const supportedTriggers: string[] = [TRIGGERS.LOAD, TRIGGERS.ON_EVENT];
    if (element) {
      behaviorElements.current = Dom.getBehaviorElements(element).filter(e => {
        const triggerAttr =
          e.getAttribute(BEHAVIOR_ATTRIBUTES.TRIGGER) || 'press';
        if (!supportedTriggers.includes(triggerAttr)) {
          Logging.warn(
            new BehaviorUnsupportedTriggerError(
              e,
              triggerAttr,
              supportedTriggers,
            ),
          );
          return false;
        }
        return true;
      });
    }
  }, [element]);

  const triggerLoadBehaviors = useCallback(() => {
    const loadBehaviors = behaviorElements.current.filter(
      e => e.getAttribute(BEHAVIOR_ATTRIBUTES.TRIGGER) === TRIGGERS.LOAD,
    );
    if (loadBehaviors.length > 0 && element) {
      Behaviors.triggerBehaviors(element, loadBehaviors, onUpdate);
    }
  }, [element, onUpdate]);

  /**
   * Logic to determine the nav route id
   */
  const getId = useCallback((p: RouteParams): string => {
    if (!p) {
      throw new NavigatorService.HvNavigatorError('No params found for route');
    }
    if (p.id) {
      if (NavigatorService.isDynamicRoute(p.id)) {
        // Dynamic routes use their url as id
        return p.url || p.id;
      }
      return p.id;
    }
    return p.url || '';
  }, []);

  /**
   * Encapsulated options for the stack screenOptions
   */
  const stackScreenOptions = useCallback(
    (route: ScreenParams): StackScreenOptions => ({
      headerMode: 'screen',
      headerShown: SHOW_DEFAULT_HEADER_UI,
      title: getId(route.params),
    }),
    [getId],
  );

  /**
   * Encapsulated options for the tab screenOptions
   */
  const tabScreenOptions = useCallback(
    (route: ScreenParams): TabScreenOptions => ({
      headerShown: SHOW_DEFAULT_HEADER_UI,
      tabBarStyle: {
        display: SHOW_DEFAULT_FOOTER_UI ? 'flex' : 'none',
      },
      title: getId(route.params),
    }),
    [getId],
  );

  /**
   * Build an individual screen
   */
  const buildScreen = useCallback(
    (
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
      if (type === NAVIGATOR_TYPE.TAB) {
        return (
          <BottomTab.Screen
            key={id}
            component={routeComponent}
            initialParams={initialParams}
            name={id}
          />
        );
      }
      if (type === NAVIGATOR_TYPE.STACK) {
        const gestureEnabled = Platform.OS === 'ios' ? !needsSubStack : false;
        return (
          <Stack.Screen
            key={id}
            component={routeComponent}
            getId={({ params: p }: ScreenParams) => getId(p)}
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
    },
    [getId, routeComponent],
  );

  /**
   * Build the card and modal screens for a stack navigator
   */
  const buildDynamicScreens = useCallback((): React.ReactElement[] => {
    const screens: React.ReactElement[] = [];

    screens.push(
      buildScreen(
        NavigatorService.ID_CARD,
        NAVIGATOR_TYPE.STACK,
        undefined,
        false,
      ),
    );

    screens.push(
      buildScreen(
        NavigatorService.ID_MODAL,
        NAVIGATOR_TYPE.STACK,
        undefined,
        true,
      ),
    );
    return screens;
  }, [buildScreen]);

  /**
   * Build all screens from received routes
   */
  const buildScreens = useCallback(
    (type: string, screenElement?: Element): React.ReactNode => {
      const screens: React.ReactElement[] = [];
      if (!screenElement) {
        return screens;
      }
      const elements: Element[] = NavigatorService.getChildElements(
        screenElement,
      );

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
          // This relies on the schema requirement that each <navigator>
          // has at least one <nav-route>
          screens.push(
            buildScreen(
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
      if (type === NAVIGATOR_TYPE.STACK) {
        screens.push(...buildDynamicScreens());
      }
      return screens;
    },
    [buildDynamicScreens, buildScreen],
  );

  useEffect(() => {
    // Constructor
    updateBehaviorElements();

    // ComponentDidMount
    triggerLoadBehaviors();
    Events.subscribe(onEventDispatch);

    // ComponentWillUnmount
    return () => {
      Events.unsubscribe(onEventDispatch);
    };
  }, [onEventDispatch, triggerLoadBehaviors, updateBehaviorElements]);

  useEffect(() => {
    // ComponentDidUpdate
    if (prevProps.current === element) {
      return;
    }
    prevProps.current = element;
    updateBehaviorElements();
    triggerLoadBehaviors();
  }, [element, triggerLoadBehaviors, updateBehaviorElements]);

  return (
    <HvDocContext>
      {({ getSourceDoc }) => {
        if (params?.needsSubStack) {
          // Build a stack navigator for a modal screen
          const doc = getSourceDoc?.();
          if (!params) {
            throw new NavigatorService.HvNavigatorError(
              'No params found for modal screen',
            );
          }

          if (!params.id) {
            throw new NavigatorService.HvNavigatorError(
              'No id found for modal screen',
            );
          }

          const navigatorId = `stack-${params?.id}`;
          const screenId = `modal-screen-${params?.id}`;

          // Generate a simple structure for the modal
          const screens: React.ReactElement[] = [];
          screens.push(
            buildScreen(
              screenId,
              NAVIGATOR_TYPE.STACK,
              params?.url || undefined,
              false,
              false,
              params?.id,
              true,
            ),
          );
          screens.push(...buildDynamicScreens());

          // Mutate the dom to match
          if (doc) {
            const route: Element | null = params?.id
              ? Dom.getElementById(doc, params.id) || null
              : null;
            if (route && !NavigatorService.getNavigatorById(doc, navigatorId)) {
              const navigator = doc.createElementNS(
                Namespaces.HYPERVIEW,
                LOCAL_NAME.NAVIGATOR,
              );
              navigator.setAttribute('id', navigatorId);
              navigator.setAttribute('type', 'stack');
              const screen = doc.createElementNS(
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
              screenOptions={({ route }) => stackScreenOptions(route)}
            >
              {screens}
            </Stack.Navigator>
          );
        }
        // Build a navigator
        if (!element) {
          throw new NavigatorService.HvNavigatorError(
            'No element found for navigator',
          );
        }

        const id: string | null | undefined = element.getAttribute('id');
        if (!id) {
          throw new NavigatorService.HvNavigatorError(
            'No id found for navigator',
          );
        }

        const type: string | null | undefined = element.getAttribute('type');
        const selected:
          | Element
          | undefined = NavigatorService.getSelectedNavRouteElement(element);

        const selectedId: string | undefined = selected
          ? selected.getAttribute('id')?.toString()
          : undefined;

        const { BottomTabBar } = navigationComponents || {};

        switch (type) {
          case NAVIGATOR_TYPE.STACK:
            return (
              <Stack.Navigator
                id={id}
                screenOptions={({ route }) => stackScreenOptions(route)}
              >
                {buildScreens(type, element)}
              </Stack.Navigator>
            );
          case NAVIGATOR_TYPE.TAB:
            return (
              <BottomTab.Navigator
                backBehavior="none"
                id={id}
                initialRouteName={selectedId}
                screenOptions={({ route }) => tabScreenOptions(route)}
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
                {buildScreens(type, element)}
              </BottomTab.Navigator>
            );
          default:
        }
        throw new NavigatorService.HvNavigatorError(
          `No navigator type '${type}'found for '${id}'`,
        );
      }}
    </HvDocContext>
  );
}
