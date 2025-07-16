import { render, screen, waitFor } from '@testing-library/react-native';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvView', () => {
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        expect(screen.getByTestId('container')).toBeOnTheScreen();
        expect(screen.getByTestId('content1')).toBeOnTheScreen();
        expect(screen.getByTestId('content2')).toBeOnTheScreen();
        expect(screen.getByTestId('content3')).toBeOnTheScreen();
        return true;
      });
    });
    test('scrollview', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/scrollview.xml`]} />);

      await waitFor(() => {
        expect(screen.getByTestId('container-vertical')).toBeOnTheScreen();
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
  });
});
