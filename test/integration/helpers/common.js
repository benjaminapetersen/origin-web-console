'use strict';


var commonTeardown = function() {
  browser.executeScript('window.sessionStorage.clear();');
  browser.executeScript('window.localStorage.clear();');
};
exports.commonTeardown = commonTeardown;

exports.commonSetup = function() {
  // Want a longer browser size since the screenshot reporter only grabs the visible window
  browser.driver.manage().window().setSize(1024, 2048);
};

exports.afterAllTeardown = function() {
  commonTeardown();
  browser.driver.sleep(1000);
};
