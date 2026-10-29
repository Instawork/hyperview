import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Logging from 'hyperview/src/services/logging';
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
  Props,
  SHOW_DEFAULT_FOOTER_UI,
  SHOW_DEFAULT_HEADER_UI,
  ScreenOptionsProps,
  ScreenParams,
  StackScreenOptions,
  TabScreenOptions,
} from './types';
import React, { useCallback, useEffect, useRef } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HvDocContext } from 'hyperview/src/elements/hv-doc';
import NavigatorStack from 'hyperview/src/components/navigator-stack';
import NavigatorTab from 'hyperview/src/components/navigator-tab';
import { getFirstChildTag } from 'hyperview/src/services/dom/helpers';
import { getStackRouteOptions } from './stack-options';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

export const Stack = NavigatorStack();
export const BottomTab = NavigatorTab();

export default function HvNavigator(props: Props) {
  // eslint-disable-next-line react/destructuring-assignment
  const {
    element,
    isModalFlow,
    isRootNavigator,
    onUpdate,
    params,
    routeComponent,
  } = props;
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
            Logging.warn(new EventTriggerError(e));
            return false;
          }
          if (!currentAttributeEventName) {
            Logging.warn(new EventMissingNameError(e));
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
  const getId = useCallback((p: RouteParams | undefined) => {
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
    return p.url || undefined;
  }, []);

  /**
   * Encapsulated options for the stack screenOptions
   */
  const stackScreenOptions = useCallback(
    ({ route }: ScreenOptionsProps): StackScreenOptions => ({
      headerShown: SHOW_DEFAULT_HEADER_UI,
      title: getId(route.params),
    }),
    [getId],
  );

  /**
   * Encapsulated options for the tab screenOptions
   */
  const tabScreenOptions = useCallback(
    ({ route }: ScreenOptionsProps): TabScreenOptions => ({
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
      usesModalPresentation: boolean,
      isFirstScreen = false,
      routeId?: string | undefined,
      ownsModalFlow = false,
    ): React.ReactElement => {
      const dynamicRouteParams: RouteParams = usesModalPresentation
        ? { isModal: true }
        : {};
      const initialParams: RouteParams = NavigatorService.isDynamicRoute(id)
        ? dynamicRouteParams
        : {
            id,
            isModal: ownsModalFlow,
            routeId,
            url: href,
          };
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
        const options = getStackRouteOptions({
          isFirstScreen,
          usesModalPresentation,
        });
        return (
          <Stack.Screen
            key={id}
            component={routeComponent}
            getId={({ params: p }: ScreenParams) => getId(p)}
            initialParams={initialParams}
            name={id}
            options={options}
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
  const buildDynamicScreens = useCallback(
    (navigatorId?: string): React.ReactElement[] => {
      const screens: React.ReactElement[] = [];
      const cardId = navigatorId
        ? NavigatorService.getDynamicRouteName(
            navigatorId,
            NavigatorService.ID_CARD,
          )
        : NavigatorService.ID_CARD;
      const modalId = navigatorId
        ? NavigatorService.getDynamicRouteName(
            navigatorId,
            NavigatorService.ID_MODAL,
          )
        : NavigatorService.ID_MODAL;

      screens.push(buildScreen(cardId, NAVIGATOR_TYPE.STACK, undefined, false));

      screens.push(buildScreen(modalId, NAVIGATOR_TYPE.STACK, undefined, true));
      return screens;
    },
    [buildScreen],
  );

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
          const ownsModalFlow =
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
              ownsModalFlow,
              index === 0,
              id,
              ownsModalFlow,
            ),
          );
        }
      });

      // Add the dynamic stack screens
      if (type === NAVIGATOR_TYPE.STACK) {
        const navigatorId = screenElement.getAttribute('id') || undefined;
        screens.push(
          ...buildDynamicScreens(isRootNavigator ? undefined : navigatorId),
        );
      }
      return screens;
    },
    [buildDynamicScreens, buildScreen, isRootNavigator],
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
      {() => {
        if (isModalFlow) {
          if (!params?.id) {
            throw new NavigatorService.HvNavigatorError(
              'No id found for modal flow',
            );
          }

          const navigatorId = `modal-flow-${params.id}`;
          const screenId = `modal-flow-root-${params.id}`;

          const screens: React.ReactElement[] = [];
          screens.push(
            buildScreen(
              screenId,
              NAVIGATOR_TYPE.STACK,
              params?.url || undefined,
              false,
              true,
              params?.id,
              true,
            ),
          );
          screens.push(...buildDynamicScreens(navigatorId));

          return (
            <Stack.Navigator
              id={navigatorId}
              screenOptions={stackScreenOptions}
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
              <Stack.Navigator id={id} screenOptions={stackScreenOptions}>
                {buildScreens(type, element)}
              </Stack.Navigator>
            );
          case NAVIGATOR_TYPE.TAB:
            return (
              <BottomTab.Navigator
                backBehavior="none"
                id={id}
                initialRouteName={selectedId}
                screenOptions={tabScreenOptions}
                tabBar={
                  BottomTabBar &&
                  ((p: BottomTabBarProps) => (
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
