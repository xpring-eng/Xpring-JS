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
      // Webpack no longer auto-polyfills for node core modules.
      // These are the polyfills for the necessary modules.
      assert: 'assert',
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      os: 'os-browserify/browser',
      stream: 'stream-browserify',
      url: 'url',
      util: 'util',
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
