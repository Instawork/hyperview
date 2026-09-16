import { render, screen, waitFor } from '@testing-library/react-native';
// eslint-disable-next-line instawork/import-components
import { ContentInsetsProvider } from 'hyperview/src/components/scroll';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

jest.mock('hyperview/src/components/web-view', () => {
  const { View } = jest.requireActual('react-native');
  return View;
});

describe('HvWebView', () => {
  describe('render', () => {
    test('does not apply content insets by default', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        expect(
          screen.getByTestId('web-view').props.contentInsetAdjustmentBehavior,
        ).toBeUndefined();
        return true;
      });
    });

    test('applies content insets when enabled', async () => {
      render(
        <ContentInsetsProvider value={{ bottom: 83 }}>
          <HyperviewMock paths={[`${__dirname}/stories/content_insets.xml`]} />
        </ContentInsetsProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('web-view').props.contentInsetAdjustmentBehavior,
        ).toEqual('never');
        expect(
          screen.getByTestId('web-view').props.injectedJavaScript,
        ).toContain("'83px'");
        return true;
      });
    });
  });
});
