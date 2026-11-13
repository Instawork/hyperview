import { DOMParser } from '@instawork/xmldom';
import { triggerPressBehaviors } from './index';

describe('triggerPressBehaviors', () => {
  test('executes default and explicit press behaviors in order', async () => {
    const element = new DOMParser().parseFromString(
      `
        <view xmlns="https://hyperview.org/hyperview">
          <behavior action="back" href="#" />
          <behavior action="custom-action" trigger="press" />
          <behavior action="replace" href="/next" trigger="press" />
          <behavior action="ignored" trigger="longPress" />
        </view>
      `,
    ).documentElement;
    const onUpdate = jest.fn();

    triggerPressBehaviors(element, onUpdate);

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenNthCalledWith(
      1,
      '#',
      'back',
      element,
      expect.objectContaining({
        behaviorElement: expect.anything(),
      }),
    );

    await Promise.resolve();

    expect(onUpdate).toHaveBeenCalledTimes(3);
    expect(onUpdate).toHaveBeenNthCalledWith(
      2,
      null,
      'custom-action',
      element,
      expect.objectContaining({
        behaviorElement: expect.anything(),
        custom: true,
      }),
    );
    expect(onUpdate).toHaveBeenNthCalledWith(
      3,
      '/next',
      'replace',
      element,
      expect.objectContaining({
        behaviorElement: expect.anything(),
      }),
    );
  });
});
