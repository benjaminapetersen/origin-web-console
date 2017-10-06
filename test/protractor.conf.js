'use strict';

let isMac = /^darwin/.test(process.platform);
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
let HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

let screenshotReporter = new HtmlScreenshotReporter({
  cleanDestination: isMac ? true : false,
  dest: './test/tmp/screenshots',
  filename: 'protractor-e2e-report.html',
  takeScreenShotsOnlyForFailedSpecs: true,
  pathBuilder: function(currentSpec, suites, browserCapabilities) {
   return browserCapabilities.get('browserName') + '/' + currentSpec.fullName;
  }
});

// https://github.com/angular/protractor/blob/master/docs/browser-setup.md
// https://github.com/angular/protractor/blob/master/docs/browser-setup.md
exports.config = {
  // TODO: decide if we want to pull these down & install them
  // and commit them so we don't have to worry about things changing
  // on us:
  // chromeDriver: '',  // https://sites.google.com/a/chromium.org/chromedriver/downloads
  // geckoDriver: '',   // https://github.com/mozilla/geckodriver/releases
  // https://github.com/angular/protractor/issues/4233
  // rootElement: 'html',
  // we want to specify individual suites, not a glob of specs
  // https://github.com/angular/protractor/blob/master/lib/config.ts#L225
  // specs: [
  //   'integration/**/*.js'
  // ],
  // running `grunt test-integration` with the --suite flag will
  // run only the suites specified:
  // grunt test-integration --suite=create-project
  // grunt test-integration --suite=create-projct,add-template-to-project
  suites: {
    'create-project': 'integration/features/user_creates_project.spec.js', // This suite of tests should only require a running master api, it should not require a node
    'add-template-to-project': 'integration/features/user_adds_template_to_project.spec.js',
    'add-imagestream-to-project': 'integration/features/user_adds_imagestream_to_project.spec.js',
    'create-from-url': 'integration/features/user_creates_from_url.spec.js',
    // simple test to ensure we can get past OAuth
    'login': 'integration/features/user_logs_in.spec.js'
  },
  //baseUrl: 'http://localhost:9000/',
  framework: 'jasmine2',
  allScriptsTimeout: 30 * 1000,
  getPageTimeout: 30 * 1000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 60 * 1000,
    isVerbose: true,
    includeStackTrace: true,
    showColors: true,
    // noop to eliminate the dot reporter, since we have
    // better reporters. see onPrepare below
    print: function() {}
  },
  capabilities: {
    // https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities#firefoxprofile-settings
    'browserName': 'chrome', // 'chrome' will run...
    // 'marionette': true,
    // 'acceptSslCerts': true, ie only?
    // 'webdriver_accept_untrusted_certs': true
    // 'logLevel': 'DEBUG'
  },
  // TODO: grunt protractor task overrides multiCapabilties, but
  // ideally we would use this to test multiple browsers.
  // multiCapabilities: [
  //   // {'browserName': 'firefox'},
  //   // {'browserName': 'chrome'}
  //   // {'browserName': 'phantomjs'}
  // ],
  onPrepare: function() {
    jasmine.getEnv().addReporter(screenshotReporter);

    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: true,
      displaySuccessfulSpec: false,
      displayFailedSpec: true
    }));
  },
  beforeLaunch: function() {
    // this should force the screenshot reporter to take a screenshot
    // if an exception is thrown from within a test
    // https://github.com/mlison/protractor-jasmine2-screenshot-reporter#tips--tricks
    process.on('uncaughtException', function () {
      screenshotReporter.jasmineDone();
      screenshotReporter.afterLaunch();
    });
  }
};
