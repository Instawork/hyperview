/* eslint-disable import/no-extraneous-dependencies */
import { Arguments, Environment } from '@expo/webpack-config/webpack/types';
import createExpoWebpackConfigAsync from '@expo/webpack-config/webpack';

module.exports = async (env: Environment, argv: Arguments) => {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['hyperview'],
      },
    },
    argv,
  );
  return config;
};
