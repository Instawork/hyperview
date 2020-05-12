'use strict';

const blacklist = require('react-native/packager/blacklist');

module.exports = {
  /**
   * This is the bombshell. New in React Native 0.30, this allows you
   * to specify your own code transformer.
   *
   * In essense, instead of specifying your own `.babelrc` file,
   * you'll want to specify your own transformer. That way, when
   * running a regular node program such as the packager itself, the
   * special transforms your app needs won't be applied.
   *
   * Equivalent to the `--transformer` command line argument.
   */
  getTransformModulePath() {
    return require.resolve('./transformer');
  },
};
