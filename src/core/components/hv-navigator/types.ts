import type { HvBehavior, HvComponent } from 'hyperview/src/types';
import { Navigation, Route } from '@react-navigation/native';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error/types';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading/types';
import React from 'react';

export declare type ViewProps = {
  back: () => void;
  behaviors: HvBehavior[];
  closeModal: () => void;
  components: HvComponent[];
  elementErrorComponent: React.ComponentType<ErrorProps>;
  entrypointUrl: string;
  errorScreen: React.ComponentType<ErrorProps>;
  fetch: (input: string, init: object) => string;
  formatDate: (date: string, format: string) => string;
  handleBack: () => void;
  loadingScreen: React.ComponentType<LoadingProps>;
  navigate: (params: object, key: string) => void;
  navigation: Navigation;
  onParseAfter: (url: string) => void;
  onParseBefore: (url: string) => void;
  openModal: (params: object) => void;
  push: (params: object) => void;
  route: Route;
};
