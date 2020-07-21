// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
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
    extensions: ['.ts', '.js'],
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
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
