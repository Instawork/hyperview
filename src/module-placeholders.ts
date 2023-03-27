/**
 * This file is used to declare modules that don't have types available on NPM.
 *
 * Mostly because we're using old versions of these libraries, and the types
 * don't exist for those versions.
 *
 * Should upgrade these libraries and remove this file.
 */

declare module 'xmldom-instawork' {
  export const DOMParser: any;
  export const XMLSerializer: any;
}

declare module '@storybook/addon-actions' {
  export const action: any;
}

declare module '@storybook/react-native' {
  export const storiesOf: any;
}

declare module 'react-native-keyboard-aware-scrollview' {
  export const KeyboardAwareScrollView: any;
}
