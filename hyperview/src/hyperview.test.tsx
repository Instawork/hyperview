import { render, screen, waitFor } from '@testing-library/react-native';
import Hyperview from './hyperview';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { fetchFactory } from 'hyperview/test/helpers/fetch';

describe('Hyperview', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const formatDate = jest.fn();

  /**
   * Test for a view which has two behaviors which originally caused a bug.
   * Uses the `behaviorView` test content.
   */
  describe('Behaviors', () => {
    /**
     * Encapsulates the fetch calls for the behavior tests.
     * Returns a mock fetch method which will return the expected responses.
     */
    const behaviorFetchFactory = (content: string) => {
      return fetchFactory([
        [
          'http://myapp.com/navigator',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <navigator id="root" type="stack">
                <nav-route id="home" href="http://myapp.com/view" />
              </navigator>
            </doc>
          `,
        ],
        [
          'http://myapp.com/view',
          `
            <doc xmlns="https://hyperview.org/hyperview">
              <screen>
                <body>
                  <text id="behavior-view-text">Behavior View</text>
                  ${content}
                </body>
              </screen>
            </doc>
          `,
        ],
        [
          'http://myapp.com/replacement-view',
          `
            <view xmlns="https://hyperview.org/hyperview" id="replacement-view">
              <text id="replacement-view-text">Replacement View</text>
            </view>
          `,
        ],
      ]);
    };

    /**
     * Encapsulates the expectations for the behavior tests.
     * Asserts that the fetch method was called the correct number of times
     * and with the correct arguments.
     * Asserts that the behavior view and replacement view are on the screen.
     */
    const behaviorExpectations = (fetchMethod: jest.Mock) => {
      expect(fetchMethod).toHaveBeenCalledTimes(3);
      expect(fetchMethod).toHaveBeenCalledWith(
        'http://myapp.com/navigator',
        expect.anything(),
      );
      expect(fetchMethod).toHaveBeenCalledWith(
        'http://myapp.com/view',
        expect.anything(),
      );
      expect(fetchMethod).toHaveBeenCalledWith(
        'http://myapp.com/replacement-view',
        expect.anything(),
      );
      const behaviorViewText = screen.getByTestId('behavior-view-text');
      expect(behaviorViewText).toBeOnTheScreen();
      const replacementViewText = screen.getByTestId('replacement-view-text');
      expect(replacementViewText).toBeOnTheScreen();
      return true;
    };

    const behaviorRender = (mockFetch: jest.Mock) => {
      render(
        <NavigationContainer>
          <Hyperview
            entrypointUrl="http://myapp.com/navigator"
            fetch={mockFetch}
            formatDate={formatDate}
          />
        </NavigationContainer>,
      );
    };

    describe('Reload', () => {
      /**
       * Test for a sequence of behaviors which caused a bug.
       * A sequence of behaviors is executed which shows two views and reloads the container view.
       * When the last behavior dispatches an event, the "reload" behavior causes the view
       * to be reloaded. If the loading element is shown during this time, the other behaviors
       * are not executed resulting in the views not being shown.
       *
       * The previous bug would display the loading component every time the document was reloaded.
       * The loading element should only be shown when the doc is not loaded yet.
       */
      test('Show by event', async () => {
        const mockFetch = behaviorFetchFactory(
          `
            <view id="first-behavior-view" hide="true">
              <text id="first-behavior-view-text">First Behavior View</text>
            </view>
            <view id="second-behavior-view" hide="true">
              <text id="second-behavior-view-text">Second Behavior View</text>
            </view>
            <view id="replacement-view">
              <behavior
                action="show"
                trigger="on-event"
                event-name="test-reload"
                target="first-behavior-view"
              />
              <behavior
                action="reload"
                trigger="on-event"
                href="#"
                once="true"
                event-name="test-reload"
              />
              <behavior
                action="show"
                trigger="on-event"
                event-name="test-reload"
                target="second-behavior-view"
              />
              <behavior
                action="dispatch-event"
                trigger="load"
                event-name="test-reload"
                once="true"
              />
            </view>
          `,
        );

        behaviorRender(mockFetch);

        await waitFor(
          () => {
            expect(mockFetch).toHaveBeenCalledWith(
              'http://myapp.com/navigator',
              expect.anything(),
            );
            expect(mockFetch).toHaveBeenCalledWith(
              'http://myapp.com/view',
              expect.anything(),
            );

            const firstBehaviorViewText = screen.getByTestId(
              'first-behavior-view-text',
            );
            expect(firstBehaviorViewText).toBeOnTheScreen();
            const secondBehaviorViewText = screen.getByTestId(
              'second-behavior-view-text',
            );
            expect(secondBehaviorViewText).toBeOnTheScreen();
          },
          { timeout: 2000 },
        );
      });
    });

    describe('Replace', () => {
      describe('Behaviors', () => {
        /**
         * Control test for a view with no mutation.
         * This test will pass because there is no mutation.
         */
        // PASSES BEFORE/AFTER BEHAVIOR ID GENERATION
        test('No mutation', async () => {
          const mockFetch = behaviorFetchFactory(
            `
              <view id="replacement-view">
                <behavior
                  action="replace"
                  trigger="load"
                  href="http://myapp.com/replacement-view"
                  once="true"
                />
              </view>
            `,
          );

          behaviorRender(mockFetch);

          await waitFor(
            () => {
              return behaviorExpectations(mockFetch);
            },
            { timeout: 2000 },
          );
        });

        /**
         * Test for views which have the mutation behavior before the replace behavior.
         */
        describe('Mutation before replace', () => {
          /**
           * With no delay between the mutation and replace behaviors,
           * the mutation occurs first and orphans the target element.
           */
          // FAILS BEFORE BEHAVIOR ID GENERATION
          // PASSES AFTER BEHAVIOR ID GENERATION
          test('No delay', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <behavior
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                  />

                  <behavior
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the mutation behavior,
           * the replace behavior will be executed first and the target element
           * will not be orphaned.
           */
          // PASSES BEFORE/AFTER BEHAVIOR ID GENERATION
          test('With delay on mutation', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <behavior
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                    delay="100"
                  />

                  <behavior
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the replace behavior,
           * the mutation occurs first and orphans the target element.
           */
          // FAILS BEFORE BEHAVIOR ID GENERATION
          // PASSES AFTER BEHAVIOR ID GENERATION
          test('With delay on replace', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <behavior
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                  />
                  <behavior
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    delay="100"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });
        });

        /**
         * Test for views which have the replace behavior first.
         */
        describe('Replace before mutation', () => {
          /**
           * With no delay between the replace and mutation behaviors,
           * the replace behavior occurs first and the target element
           * will not be orphaned.
           */
          // PASSES BEFORE/AFTER BEHAVIOR ID GENERATION
          test('No delay', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <behavior
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    target="replacement-view"
                  />
                  <behavior
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the mutation behavior,
           * the replace behavior will be executed first and the target element
           * will not be orphaned.
           */
          // PASSES BEFORE/AFTER BEHAVIOR ID GENERATION
          test('With delay on mutation', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <behavior
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                  />
                  <behavior
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                    delay="100"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the replace behavior,
           * the mutation occurs first and orphans the target element.
           */
          // FAILS BEFORE BEHAVIOR ID GENERATION
          // PASSES AFTER BEHAVIOR ID GENERATION
          test('With delay on replace', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <behavior
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    delay="100"
                  />
                  <behavior
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });
        });
      });

      /**
       * Using <view> elements with behavior attributes.
       */
      describe('View as behavior', () => {
        /**
         * Control test for a view with no mutation.
         * This test will pass because there is no mutation.
         */
        // PASSES BEFORE BEHAVIOR ID GENERATION
        // FAILS AFTER BEHAVIOR ID GENERATION
        // PASSES AFTER FALLBACK ELEMENT
        test('No mutation', async () => {
          const mockFetch = behaviorFetchFactory(
            `
              <view id="replacement-view">
                <view
                  action="replace"
                  trigger="load"
                  href="http://myapp.com/replacement-view"
                  once="true"
                />
              </view>
            `,
          );
          render(
            <NavigationContainer>
              <Hyperview
                entrypointUrl="http://myapp.com/navigator"
                fetch={mockFetch}
                formatDate={formatDate}
              />
            </NavigationContainer>,
          );

          await waitFor(
            () => {
              return behaviorExpectations(mockFetch);
            },
            { timeout: 2000 },
          );
        });

        /**
         * Test for views which have the mutation behavior before the replace behavior.
         */
        describe('Mutation before replace', () => {
          /**
           * With no delay between the mutation and replace behaviors,
           * the mutation occurs first and orphans the target element.
           */
          // PASSES BEFORE/AFTER BEHAVIOR ID GENERATION
          test('No delay', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <view
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                  />
                  <view
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    target="replacement-view"
                  />
                </view>
            `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the mutation behavior,
           * the replace behavior will be executed first and the target element
           * will not be orphaned.
           */
          // PASSES BEFORE/AFTER BEHAVIOR ID GENERATION
          test('With delay on mutation', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <view
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                    delay="100"
                  />
                  <view
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    target="replacement-view"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the replace behavior,
           * the mutation occurs first and orphans the target element.
           */
          // PASSES BEFORE BEHAVIOR ID GENERATION
          // FAILS AFTER BEHAVIOR ID GENERATION
          // PASSES AFTER FALLBACK ELEMENT
          test('With delay on replace', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <view
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                  />
                  <view
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    target="replacement-view"
                    delay="100"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });
        });

        /**
         * Test for views which have the replace behavior first.
         */
        describe('Replace before mutation', () => {
          /**
           * With no delay between the replace and mutation behaviors,
           * the replace behavior occurs first and the target element
           * will not be orphaned.
           */
          // PASSES BEFORE/AFTER BEHAVIOR ID GENERATION
          test('No delay', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <view
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    target="replacement-view"
                  />
                  <view
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                  />
                </view>
            `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the mutation behavior,
           * the replace behavior will be executed first and the target element
           * will not be orphaned.
           */
          // PASSES BEFORE/AFTER BEHAVIOR ID GENERATION
          test('With delay on mutation', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <view
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    target="replacement-view"
                  />
                  <view
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                    delay="100"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the replace behavior,
           * the mutation occurs first and orphans the target element.
           */
          // PASSES BEFORE BEHAVIOR ID GENERATION
          // FAILS AFTER BEHAVIOR ID GENERATION
          // PASSES AFTER FALLBACK ELEMENT
          test('With delay on replace', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="replacement-view">
                  <view
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    delay="100"
                  />
                  <view
                    action="show"
                    trigger="load"
                    target="replacement-view"
                    once="true"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });

          /**
           * With a delay on the replace behavior and the mutation behavior
           * set to immediate, the replace behavior will be executed after
           * the mutation behavior and will fail because the target element
           * will have been orphaned by the mutation.
           */
          // PASSES BEFORE BEHAVIOR ID GENERATION
          // FAILS AFTER BEHAVIOR ID GENERATION
          // PASSES AFTER FALLBACK ELEMENT
          test('With delay on replace immediate', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="hide-view" hide="true" />
                <view id="replacement-view">
                  <view
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    target="replacement-view"
                    delay="100"
                  />
                  <behavior
                    action="show"
                    trigger="load"
                    target="hide-view"
                    once="true"
                    immediate="true"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });
        });

        describe('Show before load', () => {
          /**
           * Test for a show before load behavior with no id on the target and a delay set
           */
          // PASSES BEFORE BEHAVIOR ID GENERATION
          // FAILS AFTER BEHAVIOR ID GENERATION
          // PASSES AFTER FALLBACK ELEMENT
          test('Show before without id', async () => {
            const mockFetch = behaviorFetchFactory(
              `
                <view id="local-spinner" hide="true" />
                <view id="replacement-view">
                  <view
                    action="replace"
                    trigger="load"
                    href="http://myapp.com/replacement-view"
                    once="true"
                    target="replacement-view"
                    show-before-load="local-spinner"
                    delay="100"
                  />
                </view>
              `,
            );

            behaviorRender(mockFetch);

            await waitFor(
              () => {
                return behaviorExpectations(mockFetch);
              },
              { timeout: 2000 },
            );
          });
        });
      });
    });
  });
});
