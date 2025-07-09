import { render, screen, waitFor } from '@testing-library/react-native';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvOption', () => {
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        const element = screen.getByTestId('basic-option');
        expect(element).toBeOnTheScreen();
        return true;
      });
    });
    test('custom', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/custom.xml`]} />);

      await waitFor(() => {
        const element = screen.getByTestId('custom-option');
        expect(element).toBeOnTheScreen();
        return true;
      });
    });
    test('pre-selected', async () => {
      render(
        <HyperviewMock paths={[`${__dirname}/stories/pre_selected.xml`]} />,
      );

      await waitFor(() => {
        const element = screen.getByTestId('pre-selected-option');
        expect(element).toBeOnTheScreen();
        return true;
      });
    });
  });
});
