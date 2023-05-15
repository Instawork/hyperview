import * as HvScreenProps from 'hyperview/src/core/components/hv-screen/types';
import React from 'react';

/**
 * Props used by hv-navigator
 */
export type Props = HvScreenProps.NavigationProps &
  HvScreenProps.DataProps &
  HvScreenProps.HvScreenProps & {
    handleBack: React.ComponentType;
  };
