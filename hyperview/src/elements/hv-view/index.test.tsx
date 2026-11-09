import * as Behaviors from 'hyperview/src/services/behaviors';
import { render, screen, waitFor } from '@testing-library/react-native';
import type { HeaderViewProps } from 'hyperview/src/types';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';
import { View } from 'react-native';

describe('HvView', () => {
  describe('render', () => {
    test('basic', async () => {
      await render(
        <HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />,
      );

      await waitFor(() => {
        expect(screen.getByTestId('container')).toBeOnTheScreen();
        expect(screen.getByTestId('content1')).toBeOnTheScreen();
        expect(screen.getByTestId('content2')).toBeOnTheScreen();
        expect(screen.getByTestId('content3')).toBeOnTheScreen();
        return true;
      });
    });
    test('renders header as a view without a host wrapper', async () => {
      await render(
        <HyperviewMock paths={[`${__dirname}/stories/header.xml`]} />,
      );

      await waitFor(() => {
        expect(screen.getByTestId('header')).toBeOnTheScreen();
        return true;
      });
    });
    test('wraps only header elements with the host header view', async () => {
      const triggerPressBehaviors = jest.spyOn(
        Behaviors,
        'triggerPressBehaviors',
      );
      const HeaderView = jest.fn(({ children }: HeaderViewProps) => (
        <View testID="host-header">{children}</View>
      ));

      await render(
        <HyperviewMock
          navigationComponents={{ HeaderView }}
          paths={[`${__dirname}/stories/header.xml`]}
        />,
      );

      await waitFor(() => {
        expect(screen.getByTestId('host-header')).toBeOnTheScreen();
        expect(screen.getByTestId('header')).toBeOnTheScreen();
        expect(screen.getByTestId('content')).toBeOnTheScreen();
        expect(HeaderView).toHaveBeenCalled();
        expect(
          HeaderView.mock.calls.every(
            ([props]) =>
              props.element.localName === 'header' &&
              typeof props.onPress === 'function',
          ),
        ).toBe(true);
        return true;
      });

      const [headerViewProps] = HeaderView.mock.calls[
        HeaderView.mock.calls.length - 1
      ];
      headerViewProps.onPress(headerViewProps.element);

      expect(triggerPressBehaviors).toHaveBeenCalledWith(
        headerViewProps.element,
        expect.any(Function),
      );
    });
    test('scrollview', async () => {
      await render(
        <HyperviewMock paths={[`${__dirname}/stories/scrollview.xml`]} />,
      );

      await waitFor(() => {
        const verticalScroll = screen.getByTestId('container-vertical');
        expect(verticalScroll).toBeOnTheScreen();
        expect(
          verticalScroll.props.contentInsetAdjustmentBehavior,
        ).toBeUndefined();
        expect(screen.getByTestId('child-vertical-1')).toBeOnTheScreen();
        expect(screen.getByTestId('child-vertical-2')).toBeOnTheScreen();
        expect(screen.getByTestId('child-vertical-3')).toBeOnTheScreen();
        expect(screen.getByTestId('child-vertical-4')).toBeOnTheScreen();
        expect(screen.getByTestId('child-vertical-5')).toBeOnTheScreen();
        expect(screen.getByTestId('child-vertical-6')).toBeOnTheScreen();
        expect(screen.getByTestId('container-horizontal')).toBeOnTheScreen();
        expect(screen.getByTestId('child-horizontal-1')).toBeOnTheScreen();
        expect(screen.getByTestId('child-horizontal-2')).toBeOnTheScreen();
        expect(screen.getByTestId('child-horizontal-3')).toBeOnTheScreen();
        expect(screen.getByTestId('child-horizontal-4')).toBeOnTheScreen();
        expect(screen.getByTestId('child-horizontal-5')).toBeOnTheScreen();
        expect(screen.getByTestId('child-horizontal-6')).toBeOnTheScreen();
        expect(screen.getByTestId('child-horizontal-7')).toBeOnTheScreen();
        return true;
      });
    });
    test('applies content insets when enabled', async () => {
      await render(
        <HyperviewMock paths={[`${__dirname}/stories/content_insets.xml`]} />,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('container-vertical').props
            .contentInsetAdjustmentBehavior,
        ).toEqual('automatic');
        expect(
          screen.getByTestId('container-horizontal').props
            .contentInsetAdjustmentBehavior,
        ).toBeUndefined();
        return true;
      });
    });
    test('applies the id to a single element when wrapped by a hyper-ref', async () => {
      await render(
        <HyperviewMock paths={[`${__dirname}/stories/pressable.xml`]} />,
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('pressable')).toHaveLength(1);
        expect(screen.getAllByTestId('loadable')).toHaveLength(1);
        return true;
      });
    });
    test('collapsable', async () => {
      await render(
        <HyperviewMock paths={[`${__dirname}/stories/collapsable.xml`]} />,
      );

      await waitFor(() => {
        expect(screen.getByTestId('collapsable-false')).toBeOnTheScreen();
        expect(
          screen.getByTestId('collapsable-children-false'),
        ).toBeOnTheScreen();

        return true;
      });
    });
  });
});
