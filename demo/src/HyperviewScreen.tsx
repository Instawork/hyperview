/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MAIN_STACK_NAME, MODAL_STACK_NAME } from './constants';
import type { Props, RouteParams } from './types';
import HandleBack from './HandleBack';
import Hyperview from 'hyperview';
import type { NavigationRouteParams } from 'hyperview';
import React from 'react';
import { fetchWrapper, formatDate } from './helpers';

export default (props: Props) => {
  const entrypointUrl = props.route.params?.url;

  if (!entrypointUrl) {
    return null;
  }

  const goBack = () => {
    props.navigation.pop();
  }

  const closeModal = () => {
    props.navigation.pop();
  }

  const push = (params: NavigationRouteParams) => {
    // If we're in a modal stack, push the next screen on the modal stack.
    // If we're in the main stack, push the next screen in the main stack.
    // Modal stacks will have modal param set.
    const modal = props.route.params?.modal ?? false;
    props.navigation.push(
      modal ? MODAL_STACK_NAME : MAIN_STACK_NAME,
      {
        modal,
        ...params,
      }
    );
  }

  const navigate = (params: NavigationRouteParams, key: string) => {
    // props.navigation.navigate({ key, params, routeName: MAIN_STACK_NAME });
  }

  const openModal = (params: NavigationRouteParams) => {
    props.navigation.push(MODAL_STACK_NAME, params as RouteParams);
  }

  return (
    <HandleBack>
      <Hyperview
        back={goBack}
        closeModal={closeModal}
        entrypointUrl={entrypointUrl as string}
        fetch={fetchWrapper}
        formatDate={formatDate}
        navigate={navigate}
        navigation={props.navigation}
        openModal={openModal}
        push={push}
        // @ts-ignore
        route={props.route}
      />
    </HandleBack>
  );
}
