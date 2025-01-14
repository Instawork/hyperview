import React, { PureComponent } from 'react';
import { ProviderComponentType } from './types';
import { ScrollProvider } from './context';

export const withProvider = (
  Component: ProviderComponentType,
): ProviderComponentType =>
  class ComponentWithScrollContextProvider extends PureComponent {
    render() {
      return (
        <ScrollProvider>
          <Component
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...this.props}
          />
        </ScrollProvider>
      );
    }
  };
