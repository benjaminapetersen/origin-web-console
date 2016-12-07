'use strict';

var _ = require('lodash');
var h = require('../helpers.js');
var Page = require('./page').Page;
var CatalogPage = require('./catalog').CatalogPage;

var CreateProjectPage = function(project) {
  this.project = project;
};

_.extend(CreateProjectPage.prototype, Page.prototype, {
  getUrl: function() {
    return 'create-project';
  },
  enterProjectInfo: function() {
    for (var key in this.project) {
      h.waitForElem( element( by.model( key )));
      h.setInputValue(key, this.project[key]);
    }
    return this;
  },
  submit: function() {
    var button = element(by.buttonText('Create'));
    button.click();
    return new CatalogPage(this.project);
  },
  // call createProject() so you dont have to do the above manally
  // returns a new CatalogPage()
  createProject: function() {
    this.enterProjectInfo();
    return this.submit();
  }
});

exports.CreateProjectPage = CreateProjectPage;
