import { render, screen, waitFor } from '@testing-library/react-native';
// eslint-disable-next-line instawork/import-components
import { ContentInsetsProvider } from 'hyperview/src/components/scroll';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvList', () => {
  describe('render', () => {
    test('requires document opt-in for content insets', async () => {
      render(
        <ContentInsetsProvider value>
          <HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />
        </ContentInsetsProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('list').props.contentInsetAdjustmentBehavior,
        ).toBeUndefined();
        return true;
      });
    });
    test('requires host opt-in for content insets', async () => {
      render(
        <HyperviewMock paths={[`${__dirname}/stories/content_insets.xml`]} />,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('list').props.contentInsetAdjustmentBehavior,
        ).toBeUndefined();
        return true;
      });
    });
    test('applies content insets when the host and document opt in', async () => {
      render(
        <ContentInsetsProvider value>
          <HyperviewMock paths={[`${__dirname}/stories/content_insets.xml`]} />
        </ContentInsetsProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('list').props.contentInsetAdjustmentBehavior,
        ).toEqual('automatic');
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
