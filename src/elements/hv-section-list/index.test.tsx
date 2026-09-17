import { render, screen, waitFor } from '@testing-library/react-native';
// eslint-disable-next-line instawork/import-components
import { ContentInsetsProvider } from 'hyperview/src/components/scroll';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvSectionList', () => {
  describe('render', () => {
    test('does not apply content insets by default', async () => {
      render(
        <ContentInsetsProvider value>
          <HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />
        </ContentInsetsProvider>,
      );

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
        <ContentInsetsProvider value>
          <HyperviewMock paths={[`${__dirname}/stories/content_insets.xml`]} />
        </ContentInsetsProvider>,
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
