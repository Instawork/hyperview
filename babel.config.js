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
  presets: ['module:metro-react-native-babel-preset'],
};
