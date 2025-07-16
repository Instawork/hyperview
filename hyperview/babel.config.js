module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: { hyperview: '.' },
        root: ['.'],
      },
    ],
  ],
  presets: ['module:@react-native/babel-preset'],
};
