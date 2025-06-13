import { render, screen, waitFor } from '@testing-library/react-native';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvImage', () => {
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        const element = screen.getByTestId('image');
        expect(element).toBeOnTheScreen();
        expect(element.props.source.uri).toBe(
          'https://upload.wikimedia.org/wikipedia/en/a/a4/Guns-N-Roses-1987.jpg',
        );
        expect(element.props.style).toStrictEqual([
          {
            height: 200,
            width: 200,
          },
        ]);
        return true;
      });
    });
  });
});
