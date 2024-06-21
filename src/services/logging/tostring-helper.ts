/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A helper class for working with expensive string conversions
 * The toString() is deferred until the class is stringified
 * If a function is passed in, the function will be called during stringification
 * The implementation of the logger will need to call the toString on each param
 * Example:
 *  import { deferredToString } from 'hyperview/src/services/logging';
 *  const stringData = deferredToString('foo');
 *  const expensiveData = deferredToString(()=>{return 'expensive string process'});
 *  logger.log('string:', stringData, 'expensive:', expensiveData);
 */
export class ToStringHelper {
  obj: any;

  constructor(obj: any) {
    this.obj = obj;
  }

  toString = () => {
    if (typeof this.obj === 'function') {
      return this.obj();
    }

    return this.obj;
  };
}

/**
 * Create a helper instance with the passed obj
 */
export const deferredToString = (obj: any): ToStringHelper => {
  return new ToStringHelper(obj);
};
