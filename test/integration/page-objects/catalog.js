'use strict';

var h = require('../helpers.js');
var _ = require('lodash');
var inputs = require('../helpers/inputs');
var Page = require('./page').Page;
//var logger = require('../helpers/logger');

var AddTemplateModal = function(project) {
  this.project = project;
  this.modal = element(by.css('.modal-dialog'));
  this.checkboxes = this.modal.all(by.css('input[type="checkbox"]'));
  this.processBox = this.checkboxes.get(0);
  this.saveBox = this.checkboxes.get(1);
  this.continue = this.modal.element(by.cssContainingText('.btn-primary', 'Continue'));
  this.cancel = this.modal.element(by.cssContainingText('.btn-default', 'Cancel'));
  this.process = function() {
    inputs.check(this.processBox);
    inputs.uncheck(this.saveBox);
    this.continue.click();
    return browser.sleep(500).then(function() {
      // lazy require to avoid potential of circular dependencies
      var CreateFromTemplatePage = require('./createFromTemplate').CreateFromTemplatePage;
      return new CreateFromTemplatePage(this.project);
    }.bind(this));
  };
  this.save = function() {
    inputs.uncheck(this.processBox);
    inputs.check(this.saveBox);
    this.cancel.click();
    browser.sleep(500);
    return this;
  };
};

var CatalogPage = function(project) {
  this.project = project;
};

_.extend(CatalogPage.prototype, Page.prototype, {
  getUrl: function() {
    // ?tab=tab=fromFile, ?tab=fromCatalog, ?tab=deployImage
    return 'project/' + this.project.name + '/create';
  },
  // TODO: push this up into Page, include a way to pass tab names to the constructor &
  // auto generate clickTab<name>() functions?
  _findTabs: function() {
    var tabs = element(by.css('.nav-tabs'));
    h.waitForElem(tabs);
    return tabs;
  },
  clickBrowseCatalog: function() {
    return this._findTabs()
               .element(by.cssContainingText('a', 'Browse Catalog'))
               .click();
  },
  clickDeployImage: function() {
    return this._findTabs()
               .element(by.cssContainingText('a', 'Deploy Image'))
               .click();
  },
  clickImport: function() {
    return this._findTabs()
               .element(by.cssContainingText('a', 'Import YAML / JSON'))
               .click();
  },
  setImportValue: function(str) {
    return browser.executeScript(function(value) {
      window.ace.edit('add-component-editor').setValue(value);
    }, str);
  },
  getImportValue: function() {
    return browser.executeScript(function() {
      return window.ace.edit('add-component-editor').getValue();
    });
  },
  submitImport: function() {
    element(by.cssContainingText('.btn-primary','Create')).click();
    return browser.sleep(500).then(function() {
      return new AddTemplateModal(this.project);
    }.bind(this));
  },
  processTemplate: function(templateStr) {
    this.clickImport();
    return this.setImportValue(templateStr).then(function() {
      return this.submitImport().then(function(addTemplateModal) {
        // implicit nav therefore returns new CreateFromTemplatePage()
        return addTemplateModal.process();
      });
    }.bind(this));
  }
});

exports.CatalogPage = CatalogPage;
