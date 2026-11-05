const mockCreateNavigatorFactory = jest.fn(
  (navigator: string) => `${navigator}Factory`,
);

jest.mock('@react-navigation/native', () => ({
  createNavigatorFactory: mockCreateNavigatorFactory,
}));
jest.mock('./native-stack-navigator', () => ({
  __esModule: true,
  default: 'NativeStackNavigator',
}));

describe('navigator stack platform selection', () => {
  it('selects native-stack for iOS', () => {
    jest.isolateModules(() => {
      expect(jest.requireActual('./index').default).toBe(
        'NativeStackNavigatorFactory',
      );
    });

    expect(mockCreateNavigatorFactory).toHaveBeenCalledWith(
      'NativeStackNavigator',
    );
  });

  it('passes the selected stack implementation to the shared factory', () => {
    jest.isolateModules(() => {
      jest.doMock('./stack-navigator', () => ({
        __esModule: true,
        default: 'StackNavigator',
      }));

      expect(jest.requireActual('./index.tsx').default).toBe(
        'StackNavigatorFactory',
      );
    });

    expect(mockCreateNavigatorFactory).toHaveBeenCalledWith('StackNavigator');
  });
});
