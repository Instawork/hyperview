/**
 * Props for the externally provided loading screen
 */
export type Props = {
  element?: Element;
};

/**
 * Props for the loading component
 */
export type LoadingProps = {
  behaviorElementId?: number;
  routeElement?: () => Element | undefined;
};
