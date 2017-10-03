'use strict';

const windowHelper = require('../helpers/window');
const projectHelpers = require('../helpers/project');

const LoginPage = require('../page-objects/login').LoginPage;

// common setup
exports.beforeEach = () => {
  // since we manually bootstrap angular, we might have to do this?
  // browser.waitForAngular();
  windowHelper.setSize();
  let loginPage = new LoginPage();
  loginPage.login();
  browser.driver.sleep(1000);
  projectHelpers.deleteAllProjects();
};


// common tear down
exports.afterEach = () => {
  windowHelper.clearStorage();
};
