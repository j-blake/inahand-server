/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = function (w) {
  return {
    files: [
      'server/**/*.ts',
      'server/**/*.js',
      'test/**/*.ts',
      { pattern: 'test/**/*.test.ts', ignore: true },
    ],
    tests: ['test/**/*.test.ts'],
    env: {
      type: 'node',
    },
    workers: { restart: true }, // IMPORTANT
    testFramework: 'mocha',
    setup: (wallaby) => {
      const mocha = wallaby.testFramework;
      mocha.ui('tdd');
    },
  };
};
