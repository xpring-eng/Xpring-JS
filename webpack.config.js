// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// webpack considers .web.ts and .ts to be different extensions
// We use both for web vs node implementations of some clients.
const moduleFileExtensions = ['js', 'web.ts', 'ts']

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/typescript', '@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    fallback: {
      module: false,
      dns: 'mock',
      fs: false,
      http2: false,
      net: false,
      tls: false,
      child_process: false,
      assert: 'assert',
      buffer: 'buffer',
      console: 'console-browserify',
      constants: 'constants-browserify',
      crypto: 'crypto-browserify',
      domain: 'domain-browser',
      events: 'events',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      path: 'path-browserify',
      punycode: 'punycode',
      process: 'process/browser',
      querystring: 'querystring-es3',
      stream: 'stream-browserify',
      _stream_duplex: 'readable-stream/duplex',
      _stream_passthrough: 'readable-stream/passthrough',
      _stream_readable: 'readable-stream/readable',
      _stream_transform: 'readable-stream/transform',
      _stream_writable: 'readable-stream/writable',
      string_decoder: 'string_decoder',
      sys: 'util',
      timers: 'timers-browserify',
      tty: 'tty-browserify',
      url: 'url',
      util: 'util',
      vm: 'vm-browserify',
      zlib: 'browserify-zlib',
    },
  },
  output: {
    filename: 'index.js',
    library: 'XpringJS',
    libraryTarget: 'umd',
    globalObject: "(typeof self !== 'undefined' ? self : this)",
  },
}
