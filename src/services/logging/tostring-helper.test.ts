/* eslint-disable @typescript-eslint/no-explicit-any */

import { DefaultLogger } from './default-logger';
import { deferredToString } from './tostring-helper';

const logger = new DefaultLogger();

describe('deferredToString', () => {
  describe('with string', () => {
    const helper = deferredToString('foo');
    const helperSpy = jest.spyOn(helper, 'toString');

    afterEach(() => {
      helperSpy.mockClear();
    });

    it('is NOT called during construction', () => {
      expect(helperSpy).not.toHaveBeenCalled();
    });

    it('is NOT called from console.log', () => {
      console.log('helper', helper);
      expect(helperSpy).not.toHaveBeenCalled();
    });

    it('is called when wrapped in String()', () => {
      const helperVal = String(helper);
      expect(helperSpy).toHaveBeenCalledTimes(1);
      expect(helperVal).toEqual('foo');
    });

    it('does call when string converted', () => {
      const helperVal = `${helper}`;
      expect(helperSpy).toHaveBeenCalledTimes(1);
      expect(helperVal).toEqual('foo');
    });

    it('does call when toString() is called', () => {
      const helperVal = helper.toString();
      expect(helperSpy).toHaveBeenCalledTimes(1);
      expect(helperVal).toEqual('foo');
    });

    it('does call toString when using custom logger', () => {
      logger.log('helper', helper);
      expect(helperSpy).toHaveBeenCalledTimes(1);
    });

    it('does call toString on each param when using custom logger', () => {
      logger.log('helper', helper, helper, helper);
      expect(helperSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('with func', () => {
    const expensiveMock = jest.fn(() => 'this was expensive');
    const helper = deferredToString(expensiveMock);

    afterEach(() => {
      expensiveMock.mockClear();
    });

    it('is NOT called during construction', () => {
      expect(expensiveMock).not.toHaveBeenCalled();
    });

    it('is NOT called from console.log', () => {
      console.log('helper', helper);
      expect(expensiveMock).not.toHaveBeenCalled();
    });

    afterEach(() => {
      expensiveMock.mockClear();
    });

    it('is called when wrapped in String()', () => {
      const helperVal = String(helper);
      expect(expensiveMock).toHaveBeenCalledTimes(1);
      expect(helperVal).toEqual('this was expensive');
    });

    it('does call when string converted', () => {
      const helperVal = `${helper}`;
      expect(expensiveMock).toHaveBeenCalledTimes(1);
      expect(helperVal).toEqual('this was expensive');
    });

    it('does call when toString() is called', () => {
      const helperVal = helper.toString();
      expect(expensiveMock).toHaveBeenCalledTimes(1);
      expect(helperVal).toEqual('this was expensive');
    });

    it('does call toString when using custom logger', () => {
      logger.log('helper', helper);
      expect(expensiveMock).toHaveBeenCalledTimes(1);
    });

    it('does call toString on each param when using custom logger', () => {
      logger.log('helper', helper, helper, helper);
      expect(expensiveMock).toHaveBeenCalledTimes(3);
    });
  });
});
