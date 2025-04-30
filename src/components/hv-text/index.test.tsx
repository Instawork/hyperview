import { render, screen, waitFor } from '@testing-library/react-native';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvImage', () => {
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        const element = screen.getByText('Hello, world!');
        expect(element).toBeOnTheScreen();
        return true;
      });
    });
    test('nested', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/nested.xml`]} />);

      await waitFor(() => {
        const element = screen.getByText('Hello, world!');
        expect(element).toBeOnTheScreen();
        return true;
      });
    });
    test('preformatted', async () => {
      render(
        <HyperviewMock paths={[`${__dirname}/stories/preformatted.xml`]} />,
      );

      await waitFor(() => {
        const element = screen.getByText('Hello, world!');
        expect(element).toBeOnTheScreen();
        return true;
      });
    });
    test('selectable', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/selectable.xml`]} />);

      await waitFor(() => {
        const element = screen.getByText('Hello, world!');
        expect(element).toBeOnTheScreen();
        return true;
      });
    });
  });
});
