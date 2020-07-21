// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

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
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            outDir: './dist',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: moduleFileExtensions.map((ext) => `.${ext}`),
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell webpack to provide empty mocks for them so importing them works.
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'XpringJS',
    libraryTarget: 'umd',
    globalObject: "(typeof self !== 'undefined' ? self : this)",
  },
}
