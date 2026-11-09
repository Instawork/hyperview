import * as DomErrors from 'hyperview/src/services/dom/errors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { Provider, removeElements, useBackBehaviorContext } from './context';
import { act, render } from '@testing-library/react-native';
import { DOMParser } from '@instawork/xmldom';
import React from 'react';

const testDoc = `
<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <view>
        <behavior
          trigger="back"
          action="hide"
          target="foo"
        />
        <behavior
          trigger="back"
          action="show"
          target="bar"
        />
        <behavior
          trigger="on-event"
          event-name="foo"
        />
      </view>
    </body>
  </screen>
</doc>
`;

/**
 * Parser used to parse the document
 */
const parser = new DOMParser({
  errorHandler: {
    error: (error: string) => {
      throw new DomErrors.XMLParserError(error);
    },
    fatalError: (error: string) => {
      throw new DomErrors.XMLParserFatalError(error);
    },
    warning: (error: string) => {
      throw new DomErrors.XMLParserWarning(error);
    },
  },
  locator: {},
});

describe('BackBehaviorRemove', () => {
  const doc = parser.parseFromString(testDoc);

  it('should find 3 behaviors', () => {
    const behaviors = doc.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'behavior',
    );
    expect(behaviors.length).toEqual(3);
  });

  it('should find 2 back behaviors', () => {
    const behaviors = doc.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'behavior',
    );
    const backBehaviors = Array.from(behaviors).filter(
      behavior => behavior.getAttribute('trigger') === 'back',
    );

    expect(backBehaviors.length).toEqual(2);
  });

  it('should remove 2 back behaviors', () => {
    const behaviors = Array.from(
      doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'behavior'),
    );
    const backBehaviors = Array.from(behaviors).filter(
      behavior => behavior.getAttribute('trigger') === 'back',
    );

    const updatedBehaviors = removeElements(behaviors, backBehaviors);
    expect(updatedBehaviors.length).toEqual(1);
  });
});

describe('BackBehaviorProvider', () => {
  it('notifies consumers when registrations change', async () => {
    const [behavior] = Array.from(
      parser
        .parseFromString(testDoc)
        .getElementsByTagNameNS(Namespaces.HYPERVIEW, 'behavior'),
    );
    const onUpdate = jest.fn();
    let context: ReturnType<typeof useBackBehaviorContext> | undefined;
    let renders = 0;
    const Consumer = () => {
      context = useBackBehaviorContext();
      renders += 1;
      return null;
    };

    await render(
      React.createElement(Provider, null, React.createElement(Consumer)),
    );
    if (!context) {
      throw new Error('Expected BackBehavior context');
    }
    const initialRenders = renders;

    await act(() => context?.add([behavior], onUpdate));
    expect(renders).toBe(initialRenders + 1);

    await act(() => {
      context?.remove([behavior]);
      context?.add([behavior], onUpdate);
    });
    expect(renders).toBe(initialRenders + 2);

    await act(() => context?.remove([behavior]));
    expect(renders).toBe(initialRenders + 3);
  });
});
