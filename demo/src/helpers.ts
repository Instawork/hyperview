/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import moment from 'moment';

export const formatDate = (date: Date | null | undefined, format: string | undefined) => moment(date).format(format);

export const fetchWrapper = (input: RequestInfo | URL, init: RequestInit | undefined = { headers: {} }): Promise<Response> => {
  return fetch(input, {
    ...init,
    mode: "cors",
    headers: {
      // Don't cache requests for the demo
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Expires: '0',
      Pragma: 'no-cache',
      ...init.headers,
    }
  });
}
