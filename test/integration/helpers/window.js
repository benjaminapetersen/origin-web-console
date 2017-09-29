'use strict';

// FIXME: these are nice methods, but something has changed in the API
// will come back and fix once the tests run again.
exports.setSize = (height = 2024, width = 2048) => {
  console.log('deprecated, browsers are fussy');
  // return browser.driver.manage().window().setSize(height, width);
  // hacking around with solutions:
  // browser.driver.executeScript(function(height, width) {
  //     return {
  //         width: width || window.screen.availWidth,
  //         height: height || window.screen.availHeight
  //     };
  // }, height, width).then(function(result) {
  //     browser.driver.manage().window().setSize(result.width, result.height);
  // });
};

exports.maximize = () => {
  console.log('deprecated, browsers are fussy');
  return browser.driver.manage().window().maximize();
};


exports.clearStorage = () => {
  browser.executeScript('window.sessionStorage.clear();');
  browser.executeScript('window.localStorage.clear();');
}
