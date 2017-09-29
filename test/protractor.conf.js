'use strict';

exports.config = {
  // https://github.com/angular/protractor/issues/4233
  // rootElement: 'html',
  specs: [
    'integration/**/*.js'
  ],
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
    'login': 'integration/features/user_logs_in.spec.js',
    // e2e: 'integration/e2e.js'
  },
  //baseUrl: 'http://localhost:9000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true
  },
  multiCapabilities: [
    // {'browserName': 'firefox'},
    {'browserName': 'chrome'}
    //{'browserName': 'phantomjs'}
  ],
  // do we still use this?
  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
}
