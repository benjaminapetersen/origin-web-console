'use strict';

exports.config = {
  specs: [
    'integration/**/*.js'
  ],
  suites: {
    'create-project': 'integration/features/user_creates_project.spec.js', // This suite of tests should only require a running master api, it should not require a node
    'add-template-to-project': 'integration/features/user_adds_template_to_project.spec.js',
    'add-imagestream-to-project': 'integration/features/user_adds_imagestream_to_project.spec.js',
    'create-from-url': 'integration/features/user_creates_from_url.spec.js',
    // e2e: 'integration/e2e.js'
  },
  //baseUrl: 'http://localhost:9000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true
  },
  multiCapabilities: [
    //{'browserName': 'firefox'},
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
