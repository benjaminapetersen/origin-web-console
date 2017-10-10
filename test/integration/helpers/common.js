'use strict';

const windowHelper = require('../helpers/window');
const projectHelpers = require('../helpers/project');
const LoginPage = require('../page-objects/login').LoginPage;
// TODO: perhaps move to a log helper, is getting complex.
const browserLogs = require('protractor-browser-logs');

function simple(entries) {
  entries.forEach(function (entry) {
    console.log([entry.level.name, entry.message].join(': '));
  });
}

function colored(entries) {
  var colors = {
    INFO: 35 /* magenta */,
    WARNING: 33 /* yellow */,
    SEVERE: 31 /* red */
  };
  entries.forEach(function (entry) {
    console.log('\u001b[' + (colors[entry.level.name] || 37) + 'm' + [entry.level.name, entry.message].join(': ') + '\u001b[39m');
  });
}

let logs = browserLogs(browser, {
  reporters: [simple, colored]
});

exports.beforeEach = () => {
  // if there is errors in the browser logs, we want to
  // collect them & fail out the test.
  logs.reset();
  logs.ignore(logs.INFO);
  logs.ignore(logs.DEBUG);
  logs.ignore(logs.WARN);
  // we manually bootstrap angular, so it is suggested to do this
  // call up front, however it has not been needed thus far.
  // browser.waitForAngular();
  windowHelper.setSize();
  let loginPage = new LoginPage();
  loginPage.login();
  browser.driver.sleep(1000);
  projectHelpers.deleteAllProjects();
};


exports.afterEach = () => {
  windowHelper.clearStorage();
  return logs.verify();
};
