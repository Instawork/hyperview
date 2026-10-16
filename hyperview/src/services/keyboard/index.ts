type KeyboardDismissMode = 'none' | 'on-drag' | 'interactive';
type KeyboardShouldPersistTaps = 'never' | 'always' | 'handled';

export const getKeyboardDismissMode = (
  element: Element,
): KeyboardDismissMode | undefined => {
  const mode = element.getAttribute('keyboard-dismiss-mode');
  switch (mode) {
    case 'none':
    case 'on-drag':
    case 'interactive':
      return mode;
    default:
      return undefined;
  }
};

export const getKeyboardShouldPersistTaps = (
  element: Element,
): KeyboardShouldPersistTaps => {
  const mode = element.getAttribute('keyboard-should-persist-taps');
  switch (mode) {
    case 'never':
    case 'always':
    case 'handled':
      return mode;
    default:
      return 'never';
  }
};
