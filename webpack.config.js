module.exports = {
    entry: './build/src/index.js',
    output: {
      filename: 'bundled.js',
      libraryTarget: 'var',
      library: 'EntryPoint'
    }
  };