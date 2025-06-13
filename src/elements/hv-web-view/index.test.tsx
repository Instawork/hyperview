import { render, screen, waitFor } from '@testing-library/react-native';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvWebView', () => {
  describe('render', () => {
    test.skip('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        expect(screen.getByTestId('web-view')).toBeOnTheScreen();
        return true;
      });
    });
  });
});
