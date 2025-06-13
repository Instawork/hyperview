import { render, screen, waitFor } from '@testing-library/react-native';
import { HyperviewMock } from 'hyperview/test/helpers';
import React from 'react';

describe('HvSpnner', () => {
  describe('render', () => {
    test('basic', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/basic.xml`]} />);

      await waitFor(() => {
        const element = screen.getByTestId('spinner');
        expect(element).toBeOnTheScreen();
        expect(element.props.color).toBe('#8d9494');
        return true;
      });
    });
    test('colored', async () => {
      render(<HyperviewMock paths={[`${__dirname}/stories/colored.xml`]} />);

      await waitFor(() => {
        const element = screen.getByTestId('spinner');
        expect(element).toBeOnTheScreen();
        expect(element.props.color).toBe('red');
        return true;
      });
    });
  });
});
