'use strict';

// http://blog.ng-book.com/executing-async-javascript-in-protractor/
// - the create-from-url suite will need to be updated to pull templates/images
//   from whatever namespace is added to the whitelist since there ins't a way
//   to give access to 'openshift' for installing templates and things initially.
// - the browse catalog flow can be run w/o needing this, however
exports.addNamespaceToCreateWhitelist = function(namespace) {
  return browser.executeScript(function() {
    window.CREATE_FROM_URL_WHITELIST.push(namespace);
  });
};
