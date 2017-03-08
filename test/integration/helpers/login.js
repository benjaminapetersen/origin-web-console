'use strict';

exports.login = function(loginPageAlreadyLoaded) {
  // The login page doesn't use angular, so we have to use the underlying WebDriver instance
  var driver = browser.driver;
  if (!loginPageAlreadyLoaded) {
    browser.get('/');
    driver.wait(function() {
      return driver.isElementPresent(by.name("username"));
    }, 3000);
  }

  driver.findElement(by.name("username")).sendKeys("e2e-user");
  driver.findElement(by.name("password")).sendKeys("e2e-user");
  driver.findElement(by.css("button[type='submit']")).click();

  driver.wait(function() {
    return driver.isElementPresent(by.css(".navbar-iconic .username"));
  }, 5000);
};
