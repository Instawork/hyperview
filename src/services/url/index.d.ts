/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Turns the href into a fetchable URL.
 * If the href is fully qualified, return it.
 * Otherwise, pull the protocol/domain/port from base URL and append the href.
 */
export declare const getUrlFromHref: (href: string, baseUrl: string) => string;
/**
 * Add dictionary of parameters to an url
 */
export declare const addParamsToUrl: (url: string, params: Array<{
    name: string;
    value: string;
}>) => string;
/**
 * Add FormData as query params to a url. Ignores files in the formdata.
 */
export declare const addFormDataToUrl: (url: string, formData?: FormData | null) => string;
