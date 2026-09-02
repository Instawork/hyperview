import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';
import type { HvComponentProps } from 'hyperview';
import { SafeAreaView } from 'react-native-safe-area-context';

export const TabBarAppearance = {
  custom: 'custom',
  glass: 'glass',
} as const;

export const TabBarMinimize = {
  never: 'never',
  onScrollDown: 'onScrollDown',
  onScrollUp: 'onScrollUp',
} as const;

export type TabBarAppearanceMode = typeof TabBarAppearance[keyof typeof TabBarAppearance];

export type TabBarMinimizeBehavior = typeof TabBarMinimize[keyof typeof TabBarMinimize];

const APPEARANCE_OPTIONS = [
  { label: 'Glass', value: TabBarAppearance.glass },
  { label: 'Custom', value: TabBarAppearance.custom },
] as const;

const MINIMIZE_OPTIONS = [
  {
    compactLabel: 'never',
    label: 'Never',
    value: TabBarMinimize.never,
  },
  {
    compactLabel: 'scroll down',
    label: 'On scroll down',
    value: TabBarMinimize.onScrollDown,
  },
  {
    compactLabel: 'scroll up',
    label: 'On scroll up',
    value: TabBarMinimize.onScrollUp,
  },
] as const;

const DEFAULT_MODE = TabBarAppearance.glass;
const DEFAULT_MINIMIZE_BEHAVIOR = TabBarMinimize.onScrollDown;

const isLiquidGlassSupported =
  Platform.OS === 'ios' && Number.parseFloat(String(Platform.Version)) >= 26;

/**
 * True under screens Tabs.Host. Loading must not mount a View as the
 * tab screen's first child, or UIKit never binds the later ScrollView
 * for tabBarMinimizeBehavior.
 */
export const NativeTabHostContext = createContext(false);

export const useNativeTabHost = () => useContext(NativeTabHostContext);

type State = Record<string, HvComponentProps>;

type Action = {
  type: string;
  payload: {
    navigator: string;
  } & Partial<{
    props: HvComponentProps;
    element: Element;
  }>;
};

type BottomTabBarContextValue = {
  getElementProps:
    | ((navigator: string) => HvComponentProps | undefined)
    | undefined;
  isLiquidGlassSupported: boolean;
  minimizeBehavior: TabBarMinimizeBehavior;
  mode: TabBarAppearanceMode;
  resolved: TabBarAppearanceMode;
  setElement: ((navigator: string, element: Element) => void) | undefined;
  setElementProps:
    | ((navigator: string, props: HvComponentProps) => void)
    | undefined;
  setMinimizeBehavior: (behavior: TabBarMinimizeBehavior) => void;
  setMode: (mode: TabBarAppearanceMode) => void;
};

function resolveAppearance(
  mode: TabBarAppearanceMode,
  supported: boolean,
): TabBarAppearanceMode {
  if (mode === TabBarAppearance.custom || !supported) {
    return TabBarAppearance.custom;
  }
  return TabBarAppearance.glass;
}

/**
 * React context that provides the Hyperview demo app with a state
 * holding the navigation elements rendered by each screens that
 * React navigation navigators use to drive navigation.
 */
const Context = createContext<BottomTabBarContextValue>({
  getElementProps: undefined,
  isLiquidGlassSupported: false,
  minimizeBehavior: DEFAULT_MINIMIZE_BEHAVIOR,
  mode: DEFAULT_MODE,
  resolved: resolveAppearance(DEFAULT_MODE, isLiquidGlassSupported),
  setElement: undefined,
  setElementProps: undefined,
  setMinimizeBehavior: () => undefined,
  setMode: () => undefined,
});

const initialState: State = {};

type Reducer<S, A> = (prevState: S, action: A) => S;

const reducer: Reducer<State, Action> = (
  state: State = initialState,
  action: Action,
) => {
  const { element, navigator, props } = action.payload;
  switch (action.type) {
    case 'SET_ELEMENT_PROPS':
      if (!props) {
        return state;
      }
      return {
        ...state,
        [navigator]: props,
      };
    case 'SET_ELEMENT':
      if (!element) {
        return state;
      }
      return {
        ...state,
        [navigator]: {
          ...(state[navigator] || {}),
          element,
        },
      };
    default:
      return state;
  }
};

const TabBarOptions = () => {
  const {
    minimizeBehavior,
    mode,
    resolved,
    setMinimizeBehavior,
    setMode,
  } = useBottomTabBarContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const minimizeOption = MINIMIZE_OPTIONS.find(
    option => option.value === minimizeBehavior,
  );
  const toggleLabel = isLiquidGlassSupported
    ? `Tabs: ${mode} · ${minimizeOption?.compactLabel}`
    : 'glass: unsupported';

  return (
    <>
      {menuOpen ? (
        <Pressable
          accessibilityLabel="Dismiss tab bar options"
          onPress={() => setMenuOpen(false)}
          style={styles.backdrop}
        />
      ) : null}
      <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
        <View style={styles.anchor}>
          <Pressable
            accessibilityLabel="Tab bar options"
            accessibilityRole="button"
            accessibilityState={{ expanded: menuOpen }}
            onPress={() => {
              if (isLiquidGlassSupported) {
                setMenuOpen(open => !open);
              }
            }}
            style={styles.toggle}
          >
            <Text style={styles.toggleText}>{toggleLabel}</Text>
          </Pressable>
          {menuOpen && isLiquidGlassSupported ? (
            <View style={styles.menu}>
              <Text style={styles.sectionLabel}>Chrome</Text>
              {APPEARANCE_OPTIONS.map(option => {
                const selected = option.value === mode;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setMode(option.value);
                      setMenuOpen(false);
                    }}
                    style={styles.option}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
              <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
                Minimize
              </Text>
              {MINIMIZE_OPTIONS.map(option => {
                const selected = option.value === minimizeBehavior;
                const disabled = resolved !== TabBarAppearance.glass;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ disabled, selected }}
                    disabled={disabled}
                    onPress={() => {
                      setMinimizeBehavior(option.value);
                      setMenuOpen(false);
                    }}
                    style={styles.option}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                        disabled && styles.optionTextDisabled,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </>
  );
};

export function BottomTabBarContextProvider(p: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mode, setMode] = useState<TabBarAppearanceMode>(DEFAULT_MODE);
  const [
    minimizeBehavior,
    setMinimizeBehavior,
  ] = useState<TabBarMinimizeBehavior>(DEFAULT_MINIMIZE_BEHAVIOR);
  const resolved = resolveAppearance(mode, isLiquidGlassSupported);
  const getElementProps = useCallback(
    (navigator: string) => {
      return state[navigator];
    },
    [state],
  );
  const setElement = useCallback(
    (navigator: string, element: Element) => {
      dispatch({
        payload: {
          element,
          navigator,
        },
        type: 'SET_ELEMENT',
      });
    },
    [dispatch],
  );
  const setElementProps = useCallback(
    (navigator: string, props: HvComponentProps) => {
      dispatch({
        payload: {
          navigator,
          props,
        },
        type: 'SET_ELEMENT_PROPS',
      });
    },
    [dispatch],
  );
  const value = useMemo(
    () => ({
      getElementProps,
      isLiquidGlassSupported,
      minimizeBehavior,
      mode,
      resolved,
      setElement,
      setElementProps,
      setMinimizeBehavior,
      setMode,
    }),
    [
      getElementProps,
      minimizeBehavior,
      mode,
      resolved,
      setElement,
      setElementProps,
    ],
  );
  return (
    <Context.Provider value={value}>
      {p.children}
      <TabBarOptions />
    </Context.Provider>
  );
}

export const useBottomTabBarContext = () => useContext(Context);

const styles = StyleSheet.create({
  anchor: {
    alignSelf: 'flex-end',
    marginRight: 12,
    marginTop: 4,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  menu: {
    backgroundColor: 'rgba(28,28,30,0.94)',
    borderRadius: 14,
    marginTop: 6,
    minWidth: 180,
    paddingVertical: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '500',
  },
  optionTextDisabled: {
    opacity: 0.4,
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 101,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textTransform: 'uppercase',
  },
  sectionLabelSpaced: {
    marginTop: 6,
  },
  toggle: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(28,28,30,0.82)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  toggleText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
