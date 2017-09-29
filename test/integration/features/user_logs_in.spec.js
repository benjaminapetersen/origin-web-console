'use strict';

const matchersHelpers = require('../helpers/matchers');
const LoginPage = require('../page-objects/login').LoginPage;

describe('unauthenticated user', () => {
  describe('attempts to login to the web console', () => {
    it('should login the user and then be redirected to the catalog', () => {
      let loginPage = new LoginPage();
      loginPage.login();
      browser.driver.sleep(1000);
      // TODO: page-helpers/catalog.js is the old catalog.
      // will need a new catalog page-object
      matchersHelpers.expectHeading('Browse Catalog');
    });
  });
});
