'use strict';

var h = require('../helpers.js');

exports.visit = function(qs) {
  return browser.get('create' + qs);
};

exports.clickCreateNewProjectTab = function() {
  return element(by.css('.nav-tabs')).isPresent()
    .then(function(result) {
      if (result) {
        element.all(by.css('.nav-tabs > li > a')).last().click();
      }
    });
};

// ui-select breaks on spaces, so use a unique portion of the project name string (e.g., 'project name 12345', use '12345')
exports.selectExistingProject = function(stringFragment, uri) {
  return element(by.css('.nav-tabs')).isPresent()
    .then(function(result) {
      if (result) {
        // select project from the dropdown and click next
        element(by.model('selected.project')).click();
        element(by.css('.ui-select-search')).sendKeys(stringFragment).sendKeys(protractor.Key.ENTER);
        h.clickAndGo('Next', uri);
      }
    });
};
