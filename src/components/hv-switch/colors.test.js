// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getElements, getStylesheets } from 'hyperview/test/helpers';
import { LOCAL_NAME } from 'hyperview/src/types';
import { Platform } from 'react-native';
import { getColors } from './colors';

describe('HvSwitch', () => {
  describe('getColors', () => {
    let elements;
    let stylesheets;
    let originalOS;

    beforeEach(() => {
      originalOS = Platform.OS;
      const markup = `
          <doc xmlns="https://hyperview.org/hyperview">
            <screen>
              <styles>
                <style id="switch" backgroundColor="#123456" color="#987654">
                  <modifier selected="true">
                    <style backgroundColor="#654321" color="#456789" />
                  </modifier>
                  <modifier disabled="true">
                    <style backgroundColor="#765432" color="#567890" />
                  </modifier>
                  <modifier selected="true" disabled="true">
                    <style backgroundColor="#876543" color="#678901" />
                  </modifier>
                </style>
              </styles>
              <body>
                <switch style="switch" name="input1" value="on" />
                <switch style="switch" name="input2" />
                <switch style="switch" name="input3" disabled="true" />
                <switch style="switch" name="input4" disabled="true" value="on" />
              </body>
            </screen>
          </doc>
        `;
      elements = getElements(markup, LOCAL_NAME.SWITCH);
      stylesheets = getStylesheets(markup);
    });

    afterEach(() => {
      Platform.OS = originalOS;
      jest.restoreAllMocks();
    });

    describe('Android', () => {
      beforeEach(() => {
        Platform.OS = 'android';
      });
      it('returns regular styles', async () => {
        expect(getColors(elements[0], stylesheets)).toEqual({
          iosBackgroundColor: '#123456',
          thumbColor: '#987654',
          trackColor: {
            false: '#123456',
            true: '#654321',
          },
        });
      });
      it('returns selected styles', async () => {
        expect(getColors(elements[0], stylesheets)).toEqual({
          iosBackgroundColor: '#123456',
          thumbColor: '#987654',
          trackColor: {
            false: '#123456',
            true: '#654321',
          },
        });
      });
      it('returns disabled styles', async () => {
        expect(getColors(elements[0], stylesheets)).toEqual({
          iosBackgroundColor: '#123456',
          thumbColor: '#987654',
          trackColor: {
            false: '#123456',
            true: '#654321',
          },
        });
      });
      it('returns disabled + selected styles', async () => {
        expect(getColors(elements[0], stylesheets)).toEqual({
          iosBackgroundColor: '#123456',
          thumbColor: '#987654',
          trackColor: {
            false: '#123456',
            true: '#654321',
          },
        });
      });
    });
    describe('iOS', () => {
      beforeEach(() => {
        Platform.OS = 'ios';
      });
      it('returns regular styles', async () => {
        expect(getColors(elements[0], stylesheets)).toEqual({
          iosBackgroundColor: '#123456',
          thumbColor: '#987654',
          trackColor: {
            false: '#123456',
            true: '#654321',
          },
        });
      });
      it('returns selected styles', async () => {
        expect(getColors(elements[0], stylesheets)).toEqual({
          iosBackgroundColor: '#123456',
          thumbColor: '#987654',
          trackColor: {
            false: '#123456',
            true: '#654321',
          },
        });
      });
      it('returns disabled styles', async () => {
        expect(getColors(elements[0], stylesheets)).toEqual({
          iosBackgroundColor: '#123456',
          thumbColor: '#987654',
          trackColor: {
            false: '#123456',
            true: '#654321',
          },
        });
      });
      it('returns disabled + selected styles', async () => {
        expect(getColors(elements[0], stylesheets)).toEqual({
          iosBackgroundColor: '#123456',
          thumbColor: '#987654',
          trackColor: {
            false: '#123456',
            true: '#654321',
          },
        });
      });
    });
  });
});
