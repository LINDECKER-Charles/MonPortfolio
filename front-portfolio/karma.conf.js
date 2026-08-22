// Miroir de la conf built-in de @angular/build:karma (getBuiltInKarmaConfig),
// avec en plus le reporter `json-summary` pour exploiter la couverture par fichier en tooling.
const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: path.join(__dirname, 'coverage', 'front-portfolio'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'json-summary' }],
      // Seuils bloquants — alignés sur le résumé CI (.github/scripts/test-summary.mjs).
      check: {
        global: { statements: 95, lines: 95, functions: 95, branches: 80 },
      },
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadless'],
    restartOnFileChange: true,
  });
};
