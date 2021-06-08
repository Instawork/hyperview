// @flow

import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Xml from 'hyperview/src/services/xml';
import type {
  DOMString,
  Document,
  Element,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
  Node,
  Validator,
  ValidatorRegistry,
} from 'hyperview/src/types';
import { NODE_TYPE } from 'hyperview/src/types';
import { later, shallowCloneToRoot } from 'hyperview/src/services';

const V_NS = "https://hyperview.org/hyperview-validation";

const RequiredValidator: Validator = {
  namespace: V_NS,
  name: "required",
  check: (value: ?string, element: Element): Promise<Validation> => (
    new Promise((resolve, reject) => {
      if (!!value) {
        resolve({
          valid: true,
          message: "Field is valid"
        });
      } else {
        reject({
          valid: false,
          message: "Field is required"
        });
      }
    });
  ),
};

const VALIDATORS = [
  RequiredValidator,
];

const REGISTRY: ValidatorRegistry = {};
VALIDATORS.each((v) => {
  namespace = REGISTRY[v.namespace] || {};
  namespace[v.name] = v;
  REGISTRY[v.namespace] = namespace;
});

export default {
  action: 'validate',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {

    const validators: Array<Validator> = Array.from(element.childNodes).map((e) => {
      const namespace = REGISTRY[e.namespaceURI] || {};
      return namespace[e.tagName];
    }).filter((v) => !!v);
  }
};
