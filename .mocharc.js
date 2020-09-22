'use strict'

module.exports = {
  require: ['ts-node/register', 'source-map-support/register'],
  extension: ['ts'],
  spec: 'test/**/*.test.ts',

  // Do not look for mocha opts file
  opts: false,

  // Warn if test exceed 75ms duration
  slow: 75,

  // Fail if tests exceed 20000ms (20 sec)
  timeout: 20000,

  // Check for global variable leaks
  'check-leaks': true,
}
