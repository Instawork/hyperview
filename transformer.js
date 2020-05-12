'use strict';

const babel = require('babel-core');

/**
 * This is your `.babelrc` equivalent.
 */
const babelRC = {
  presets: ['react-native', 'babel-preset-react-native'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: { hyperview: './' },
      },
    ],
    [
      'babel-plugin-rewrite-require',
      {
        aliases: {
          constants: 'constants-browserify',
          crypto: 'crypto-browserify',
          dns: 'node-libs-browser/mock/dns',
          domain: 'domain-browser',
          fs: 'node-libs-browser/mock/empty',
          http: 'stream-http',
          https: 'https-browserify',
          net: 'node-libs-browser/mock/net',
          os: 'os-browserify/browser',
          path: 'path-browserify',
          querystring: 'querystring-es3',
          stream: 'stream-browserify',
          _stream_duplex: 'readable-stream/duplex',
          _stream_passthrough: 'readable-stream/passthrough',
          _stream_readable: 'readable-stream/readable',
          _stream_transform: 'readable-stream/transform',
          _stream_writable: 'readable-stream/writable',
          sys: 'util',
          timers: 'timers-browserify',
          tls: 'node-libs-browser/mock/tls',
          tty: 'tty-browserify',
          vm: 'vm-browserify',
          zlib: 'browserify-zlib',
        },
        throwForNonStringLiteral: true,
      },
    ],
  ],
  ignore: ['demo'],
};

function transform(src, filename, options) {
  const babelConfig = Object.assign({}, babelRC, {
    filename,
    sourceFileName: filename,
  });
  const result = babel.transform(src, babelConfig);
  return {
    ast: result.ast,
    code: result.code,
    map: result.map,
    filename: filename,
  };
}

module.exports = function (data, callback) {
  let result;
  try {
    result = transform(data.sourceCode, data.filename, data.options);
  } catch (e) {
    callback(e);
    return;
  }
  callback(null, result);
};
