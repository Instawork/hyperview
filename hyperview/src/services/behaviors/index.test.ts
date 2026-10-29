import { DOMParser } from '@instawork/xmldom';
import { triggerBehaviors } from './index';

describe('triggerBehaviors', () => {
  it('executes adjacent navigation behaviors independently and in order', () => {
    const doc = new DOMParser().parseFromString(`
      <view xmlns="https://hyperview.org/hyperview">
        <behavior action="close" immediate="true" trigger="load" />
        <behavior
          action="push"
          href="https://example.com/destination.xml"
          immediate="true"
          trigger="load"
        />
      </view>
    `);
    const element = doc.documentElement;
    const behaviors = Array.from(
      element.getElementsByTagNameNS(
        'https://hyperview.org/hyperview',
        'behavior',
      ),
    );
    const onUpdate = jest.fn();

    triggerBehaviors(element, behaviors, onUpdate);

    expect(onUpdate).toHaveBeenCalledTimes(2);
    expect(onUpdate.mock.calls.map(([, action]) => action)).toEqual([
      'close',
      'push',
    ]);
  });
});
