/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export default (config) => {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],

    files: [
      {
        pattern:
          'src/**/!(xrp_ledger_grpc_pb|grpc-network-client|legacy-grpc-network-client).+(js|ts)',
      },
      { pattern: 'spec/**/*.ts' },
    ],

    preprocessors: {
      'src/**/*.+(js|ts)': ['karma-typescript'],
      'src/**/!(*.d).ts': ['coverage'],
      'spec/**/*.ts': ['karma-typescript'],
    },

    reporters: ['progress', 'coverage', 'karma-typescript'],

    karmaTypescriptConfig: {
      bundlerOptions: {
        transforms: [require('karma-typescript-es6-transform')()],
      },
      compilerOptions: {
        esModuleInterop: true,
        allowJs: true,
      },
    },
    singleRun: true,
    browsers: ['ChromeHeadless'],
  })
}
