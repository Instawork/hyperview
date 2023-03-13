/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { LocalName } from 'hyperview/src/types';
export declare class UnsupportedContentTypeError extends Error {
    name: string;
}
/**
 * XML parser errors
 */
export declare class XMLParserWarning extends Error {
    name: string;
}
export declare class XMLParserError extends Error {
    name: string;
}
export declare class XMLParserFatalError extends Error {
    name: string;
}
/**
 * XML validation errors
 */
export declare class XMLRequiredElementNotFound extends Error {
    name: string;
    constructor(tag: LocalName, url: string);
}
export declare class XMLRestrictedElementFound extends Error {
    name: string;
    constructor(tag: LocalName, url: string);
}
/**
 * Fetch errors
 */
export declare class ServerError extends Error {
    name: string;
    responseHeaders: Headers;
    responseText: string;
    status: number;
    constructor(url: string, responseText: string, responseHeaders: Headers, status: number);
}
