/**
 * Props for the externally provided loading screen
 */
export type LoadingScreenProps = {
  element?: Element;
};

/**
 * Props for the loading component
 */
export type Props = {
  behaviorElementId?: number;
  fallbackElement?: () => Element | undefined;
};
