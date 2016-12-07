'use strict';

var h = require('../helpers');
var _ = require('lodash');
var Page = require('./page').Page;

var OverviewPage = function(project) {
  this.project = project;
};

_.extend(OverviewPage.prototype, Page.prototype, {
  getUrl: function() {
    return 'project/' + this.project.name + '/overview';
  },
  clickAddToProject: function() {
    var button = element(by.cssContainingText('.project-action-btn', 'Add to project'));
    h.waitForElem(button);
    // browser.wait(protractor.ExpectedConditions.elementToBeClickable(button), 2000);
    button.click();
    // lazy load to avoid future circular dependencies
    var CatalogPage = require('./catalog').CatalogPage;
    return new CatalogPage(this.project);
  }
});

exports.OverviewPage = OverviewPage;
