import { getStackPresentation } from './index';

describe('getStackPresentation', () => {
  it('uses full-screen presentation by default for modals', () => {
    expect(getStackPresentation(true, false)).toBe('fullScreenModal');
  });

  it('uses modal presentation when dismissal gestures are enabled', () => {
    expect(getStackPresentation(true, true)).toBe('modal');
  });

  it('uses card presentation for non-modal routes', () => {
    expect(getStackPresentation(false, false)).toBe('card');
  });
});
