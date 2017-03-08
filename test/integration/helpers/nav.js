'use strict';

var EC = protractor.ExpectedConditions;

exports.clickAndGo = function(buttonText, uri) {
  var button = element(by.buttonText(buttonText));
  browser.wait(EC.elementToBeClickable(button), 2000);
  button.click().then(function() {
    return browser.getCurrentUrl().then(function(url) {
      return url.indexOf(uri) > -1;
    });
  });
};

var waitForUri = function(expectedUri) {
  let actualUrl;
  return browser.wait(() => {
    return browser.getCurrentUrl().then((url) => {
      actualUrl = url;
      return actualUrl.indexOf(expectedUri) > -1;
    });
  }, 5000, "URL hasn't changed to " + expectedUri + '(is currently: ' + actualUrl + ')');
};
exports.waitForUri = waitForUri;


exports.goToPage = function(uri) {
  return browser.get(uri).then(() => {
    return waitForUri(uri);
  });
};
