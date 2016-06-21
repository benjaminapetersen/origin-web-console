'use strict';

// should externalize user?
var win = require('../helpers/window.js');
var user = require('../helpers/user.js').default;
var driver = browser.driver;

// reworking old .login() fn to .visit() as you can
// visit the login page like the other pages.
exports.visit = function() {
  //return browse.goTo('/project/' + project.name + '/browse/images');
  return driver.get('/');
};

exports.login = function(userName, pass, maxWait) {

  browser.get('/');
  driver.wait(function() {
    return driver.isElementPresent(by.name("username"));
  }, 3000);

  driver.findElement(by.name("username")).sendKeys(userName || user.name);
  driver.findElement(by.name("password")).sendKeys(pass || user.pass);
  driver.findElement(by.css("button[type='submit']")).click();

  driver.wait(function() {
    return driver.isElementPresent(by.css(".navbar-iconic .username"));
  }, maxWait || 5000);
};




exports.logout = function() {
  return win.clearStorage();
};
