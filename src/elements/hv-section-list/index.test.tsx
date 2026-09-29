import { render, screen, waitFor } from '@testing-library/react-native';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvSectionList', () => {
  describe('render', () => {
    test('does not apply content insets by default', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        expect(
          screen.getByTestId('section-list').props
            .contentInsetAdjustmentBehavior,
        ).toBeUndefined();
        return true;
      });
    });
    test('applies content insets when enabled', async () => {
      render(
        <HyperviewMock paths={[`${__dirname}/stories/content_insets.xml`]} />,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('section-list').props
            .contentInsetAdjustmentBehavior,
        ).toEqual('automatic');
        return true;
      });
    });
    test('infinite scroll', async () => {
      render(
        <HyperviewMock paths={[`${__dirname}/stories/infinite_scroll.xml`]} />,
      );

      await waitFor(() => {
        expect(screen.getByTestId('section-list')).toBeOnTheScreen();
        return true;
      });
    });
  });
});
