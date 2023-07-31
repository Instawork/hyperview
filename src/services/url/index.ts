/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {FormData} from 'hyperview/src/services/url/types';
import urlParse from 'url-parse';

const QUERY_SEPARATOR = '?';
const QUERY_PARAM_SEPARATOR = '&';

/**
 * Turns the href into a fetchable URL.
 * If the href is fully qualified, return it.
 * Otherwise, pull the protocol/domain/port from base URL and append the href.
 */
export const getUrlFromHref = (href: string, baseUrl: string): string => {
  const rootUrl = urlParse(href, baseUrl, false);
  return rootUrl.toString();
};

/**
 * Add dictionary of parameters to an url
 */
export const addParamsToUrl = (
  url: string,
  params: Array<{
    name: string,
    value: string
  }>,
): string => {
  const [baseUrl, existingParams] = url.split(QUERY_SEPARATOR);
  const query = (existingParams
    ? existingParams.split(QUERY_PARAM_SEPARATOR)
    : []
  ).concat(
    params.map(
      p => `${encodeURIComponent(p.name)}=${encodeURIComponent(p.value)}`,
    ),
  );
  return `${baseUrl}${QUERY_SEPARATOR}${query.join(QUERY_PARAM_SEPARATOR)}`;
};

/**
 * Add FormData as query params to a url. Ignores files in the formdata.
 */
export const addFormDataToUrl = (url: string, formData?: FormData | null): string => {
  if (formData) {
    if (formData.getParts) {
      const params = formData.getParts();
      return addParamsToUrl(
        url,
        params.map(p => ({
          name: p.fieldName,
          value: p.string,
        })),
      );
    }
    if (formData.entries) {
      const params = Array.from(formData.entries());
      return addParamsToUrl(
        url,
        params.map(p => ({
          name: p[0],
          value: String(p[1]),
        })),
      );
    }
  }
  return url;
};
