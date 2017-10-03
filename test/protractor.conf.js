'use strict';

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
    //'create-project': 'integration/features/user_creates_project.spec.js', // This suite of tests should only require a running master api, it should not require a node
    'add-template-to-project': 'integration/features/user_adds_template_to_project.spec.js',
    'add-imagestream-to-project': 'integration/features/user_adds_imagestream_to_project.spec.js',
    // TODO: 'create-from-url': 'integration/features/user_creates_from_url.spec.js',
    // simple test to ensure we can get past OAuth
    'login': 'integration/features/user_logs_in.spec.js',
    // e2e: 'integration/e2e.js'
    // control the sets of suites run in travis/jenkins, since we keep having issues
    // with certain suites, this can help us switch them on and off.
    'cicd': [
      'integration/features/user_logs_in.spec.js',
      'integration/features/user_adds_template_to_project.spec.js',
      'integration/features/user_adds_imagestream_to_project.spec.js'
    ]
  },
  //baseUrl: 'http://localhost:9000/',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true
  },
  // TODO: do not set this if browser is set in the Grunt task
  // multiCapabilities: [
  //   // {'browserName': 'firefox'},
  //   // {'browserName': 'chrome'}
  //   // {'browserName': 'phantomjs'}
  // ],
  // do we still use this?
  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
