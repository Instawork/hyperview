import { FlatList, Provider, ScrollView, SectionList } from './index';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { getElements } from 'hyperview/test/helpers';

const [element] = getElements(
  '<view xmlns="https://hyperview.org/hyperview" />',
  'view',
);
const [listElement] = getElements(
  '<list xmlns="https://hyperview.org/hyperview" />',
  'list',
);
const [sectionListElement] = getElements(
  '<section-list xmlns="https://hyperview.org/hyperview" />',
  'section-list',
);
const [disabledElement] = getElements(
  '<view xmlns="https://hyperview.org/hyperview" content-insets="false" />',
  'view',
);

describe('Scroll', () => {
  test('applies native header content insets to a flat list', async () => {
    await render(
      <Provider automaticContentInsets>
        <FlatList
          data={[]}
          element={listElement}
          removeClippedSubviews={false}
          renderItem={() => null}
          testID="flat-list"
        />
      </Provider>,
    );

    expect(
      screen.getByTestId('flat-list').props.contentInsetAdjustmentBehavior,
    ).toEqual('automatic');
  });
  test('applies native header content insets to a section list', async () => {
    await render(
      <Provider automaticContentInsets>
        <SectionList
          element={sectionListElement}
          removeClippedSubviews={false}
          renderItem={() => null}
          sections={[]}
          testID="section-list"
        />
      </Provider>,
    );

    expect(
      screen.getByTestId('section-list').props.contentInsetAdjustmentBehavior,
    ).toEqual('automatic');
  });
  test('applies native header content insets to a vertical scroll view', async () => {
    await render(
      <Provider automaticContentInsets>
        <ScrollView element={element} testID="scroll-view" />
      </Provider>,
    );

    expect(
      screen.getByTestId('scroll-view').props.contentInsetAdjustmentBehavior,
    ).toEqual('automatic');
  });
  test('does not apply native header content insets to a horizontal scroll view', async () => {
    await render(
      <Provider automaticContentInsets>
        <ScrollView element={element} horizontal testID="scroll-view" />
      </Provider>,
    );

    expect(
      screen.getByTestId('scroll-view').props.contentInsetAdjustmentBehavior,
    ).toBeUndefined();
  });
  test('allows a vertical scroll view to opt out of native header content insets', async () => {
    await render(
      <Provider automaticContentInsets>
        <ScrollView element={disabledElement} testID="scroll-view" />
      </Provider>,
    );

    expect(
      screen.getByTestId('scroll-view').props.contentInsetAdjustmentBehavior,
    ).toBeUndefined();
  });
  test('preserves an explicit content inset adjustment behavior', async () => {
    await render(
      <Provider automaticContentInsets>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          element={element}
          testID="scroll-view"
        />
      </Provider>,
    );

    expect(
      screen.getByTestId('scroll-view').props.contentInsetAdjustmentBehavior,
    ).toEqual('never');
  });
});
