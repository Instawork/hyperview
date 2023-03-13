/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare const HTTP_HEADERS: {
    readonly ACCEPT: "Accept";
    readonly CONTENT_TYPE: "Content-Type";
    readonly X_HYPERVIEW_DIMENSIONS: "X-Hyperview-Dimensions";
    readonly X_HYPERVIEW_VERSION: "X-Hyperview-Version";
};
export declare const HTTP_METHODS: {
    readonly GET: "get";
    readonly POST: "post";
};
export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
export declare const CONTENT_TYPE: {
    readonly APPLICATION_XML: "application/xml";
    readonly TEXT_HTML: "text/html";
};
export type Fetch = (url: string, options: {
    headers: {
        [key: string]: any;
    };
}) => Promise<Response>;
export type ErrorHandler = (error: Error) => void;
export type BeforeAfterParseHandler = (url: string) => void;
