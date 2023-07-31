/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Type needed to expose a method in FormData that default Flow types don't know about
export type FormData = Readonly<{
 // React Native implementation of global FormData
 // https://github.com/facebook/react-native/blob/d05a5d15512ab794ef80b31ef91090d5d88b3fcd/Libraries/Network/FormData.js#L73
 getParts?: () => Array<{
  fieldName: string,
  string: string
 }>,
 // Web API
 // https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries
 entries?: () => Iterator<[string, FormDataEntryValue]>
}>;
