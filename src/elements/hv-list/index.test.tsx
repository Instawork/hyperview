import { render, screen, waitFor } from '@testing-library/react-native';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvList', () => {
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        expect(screen.getByTestId('list')).toBeOnTheScreen();
        return true;
      });
    });
    test('infinite scroll', async () => {
      render(
        <HyperviewMock paths={[`${__dirname}/stories/infinite_scroll.xml`]} />,
      );

      await waitFor(() => {
        expect(screen.getByTestId('list')).toBeOnTheScreen();
        return true;
      });
    });
  });
});
