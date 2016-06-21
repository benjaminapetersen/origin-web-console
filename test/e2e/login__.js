'use strict';

require('jasmine-beforeall');

var user = require('../helpers/user.js');
var loginPage = require('../page_objects/loginPage.js');

describe('openshift login', function() {

  describe('unauthenticated user', function() {
    loginPage.visit();
  });

  describe('authenticated user (e2e-user)', function() {

  });

});
